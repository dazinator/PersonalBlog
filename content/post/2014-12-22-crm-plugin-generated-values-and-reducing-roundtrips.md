---
layout: post
published: true
title: "CRM / Plugin Generated Values - and Reducing Roundtrips!"
comments: true
categories: Dynamics CRM
---

## Setting the Scene
Imagine we have an application that uses the CRM SDK. It needs to:

1. Create a new `account` entity in crm.
2. Get some value that was just generated as a result of a synchronous plugin that fires on the create. For example, suppose there is a plugin that generates an account reference number.

## The "I don't care about network latency method!"
The 'I don't care about network latency' way of dealing with this is to just do 2 seperate Requests (roundtrips) with the CRM server.

1. Create the new `account` which returns you the ID.
2. Retrieve the `account` using that ID, along with the values that you need.

This approach is sub optimal where network latency is a concern, as it incurs the penalty of making two roundtrips accross the network with the server, where 1 is possible.

Let's now have a look at the "I'm running on a 56k modem method" of doing the same thing!
<!-- more -->

## The "I'm running on a 56k modem method" - this weeks pro tip!
For quite some time now - as of `CRM 2011 Update Rollup 12 - (SDK 5.0.13)` you can utilise the [Execute Multiple](http://msdn.microsoft.com/en-gb/library/jj863604.aspx) request to do this kind of thing in one roundtrip with the CRM server.

Here is an example of creating an account, and retrieiving it in a single round trip:

``` csharp
 				 // Create an ExecuteMultipleRequest object.
                var multipleRequests = new ExecuteMultipleRequest()
                {
                    // Assign settings that define execution behavior: continue on error, return responses. 
                    Settings = new ExecuteMultipleSettings()
                    {
                        ContinueOnError = false,
                        ReturnResponses = true
                    },
                    // Create an empty organization request collection.
                    Requests = new OrganizationRequestCollection()
                };

                var entity = new Entity("account");
                entity.Id = Guid.NewGuid();
                entity["name"] = "experimental test";

                CreateRequest createRequest = new CreateRequest
                {
                    Target = entity
                };

                RetrieveRequest retrieveRequest = new RetrieveRequest
                {
                    Target = new EntityReference(entity.LogicalName, entity.Id),
                    ColumnSet = new ColumnSet("createdon") // list the fields that you want here
                };

                multipleRequests.Requests.Add(createRequest);
                multipleRequests.Requests.Add(retrieveRequest);

                // Execute all the requests in the request collection using a single web method call.
                ExecuteMultipleResponse responseWithResults = (ExecuteMultipleResponse)orgService.Execute(multipleRequests);
                             
                var createResponseItem = responseWithResults.Responses[0];
                CreateResponse createResponse = null;
                if (createResponseItem.Response != null)
                {
                    createResponse = (CreateResponse)createResponseItem.Response;
                }

                var retrieveResponseItem = responseWithResults.Responses[1];

                RetrieveResponse retrieveResponse = null;
                if (retrieveResponseItem.Response != null)
                {
                    retrieveResponse = (RetrieveResponse)retrieveResponseItem.Response;
                }

                Console.Write(retrieveResponse.Entity["createdon"]); // yup - we got the value we needed!

```

## What happened?
Both the CreateRequest, and the RetrieveRequest (for the created entity) are batched up into a single Request and shipped off to the CRM server for processing.

CRM processed them in that order, collated the responses together, and returned them in a single batch.

## Caveats
One caveat of this approach is that, if you intend to grab the generated values for an entity that is being created, then you need to know in advance what the ID will be.

This means you have to specify the ID of the entity when you create it yourself - you can't let CRM auto create the new ID. 

For updates / deletes this is a non issue, as the ID is allready known.

## Last thoughts - SQL Optimisation
I speculate that specifying your own ID's _might be a bad thing_ if you don't use Sequential Guid's.

When CRM generates Id's for you, it generates them sequentially, and I beleive there may be SQL performance benefits to this in terms of index optimisation etc. So if using Guid.NewGuid() to create your new Id's you may want to check with a SQL guru first to understand any impact of using random Guid's as Id's on performance of the CRM tables! That said - Microsoft do support this, so it can't be too bad..