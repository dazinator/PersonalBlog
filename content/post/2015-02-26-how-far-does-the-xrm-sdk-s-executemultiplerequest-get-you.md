---
layout: post
published: true
title: "How far does the XRM SDK's ExecuteMultipleRequest get you?"
date: 2015-02-26
comments: true
categories: 
    - "Development"
tags: 
    - "Dynamics CRM"
---

### ExecuteMultipleRequest - Let's take it to the max

In this post, I will explore what kinds of things can be achieved using the SDK's ExecuteMultipleRequest, by starting of with a simple SQL command, and implementing a semantically equivalent ExecuteMultipleRequest, and then slowly introducing some additional complexity - so that, we can see some areas where the SDK starts to fall short!

<!--more-->

### Starting Simple
Consider this SQL:

```sql
INSERT INTO contact (firstname, lastname) VALUES ('albert', 'einstein');
```

Well you hardly need a ExecuteMultipleRequest for this, but if you really wanted to you could create one no problem. I am going to assume you are already familiar with the code to create a ExecuteMultipleRequest - if not it's described [here.](https://msdn.microsoft.com/en-gb/library/jj863631.aspx)

This equates to the following:

Either:-
<ol>
  <li>A single CreateRequestMessage.</li>
  <li>An ExecuteMultipleRequest containing a single CreateRequestMessage.</li>
</ol>
  
I hope you are with me so far..

### Take It Up A Notch

Let's now imagine that when a contact is INSERTED, an `accountnumber` is generated on the server, and that we want to grab this value using a single roundtrip with the server.

Here's it is in T-SQL:

```sql
INSERT INTO contact (firstname, lastname) OUTPUT inserted.accountnumber VALUES ('albert', 'einstein');
```

This equates to the following using the SDK:-

SORRRY DAVE. YOU CAN'T DO THAT.

The problem being, is that to do this in one roundtrip with the CRM server means building an ExecuteMultipleRequest that contains:-

<ol>
  <li>A CreateRequestMessage (to insert / create the contact)</li>
  <li>A RetrieveRequestMessage (to retrieve the accountnumber of the inserted contact)</li>
</ol>

However in order to construct the appropriate RetrieveRequestMessage we need to know the ID of what the inserted contact will be in advance. If you look at the SQL query - we are not specifying an ID in advance - therefore we cannot perform the equivalent to this query.

### A bit further..

With the previous example in mind, consider the following SQL

```sql
INSERT INTO contact (contactid, firstname, lastname) OUTPUT inserted.accountnumber VALUES ('2f4941ec-2f6f-4c7f-8adc-c6f4fb002d42', 'albert', 'einstein');
```

If you are quick, you've already cottoned on that this one is possible, and it equates to:-

An ExecuteMultipleRequest (ContinueOnError = false) containing:-

<ol>
  <li>A CreateRequestMessage (to insert / create the contact) 
  </li>
  <li>A RetrieveRequestMessage - to retrieve the "accountnumber" of the created entity)</li>
</ol>

### Let's start to push the boat out a little.
Here is a batch of T-SQL commands:

```sql
INSERT INTO contact (firstname, lastname) VALUES ('albert', 'einstein');
UPDATE contact SET lastname = 'Johnson' WHERE contactid = '3a4941ec-2f6f-4c7f-8adc-c6f4fb002d42';
DELETE FROM contact WHERE contactid = '4b4941ec-2f6f-4c7f-8adc-c6f4fb002d42'
```

Now, we know that SQL Server would execute that SQL, by executing each sql command within that batch in sequence, and if there were any errors it will not continue to process the rest of the commands in the same batch. It would also not execute that batch within a transaction, so it would not roll back should errors occur half way through etc.

This equates to:

An ExecuteMultipleRequest (ContinueOnError = false) - containing the following messages:
<ol>
  <li>A CreateRequestMessage (to insert / create the contact) 
  </li>
  <li>An UpdateRequestMessage(to update the contact)</li>
  <li>A DeleteRequestMessage</li>
</ol>

It seems like this is a good fit between the SQL and an ExecuteMultipleRequest.

### The boat is now heading towards the open ocean
Let's add a bit of complexity to the previous T-SQL - consider this:

```sql
INSERT INTO contact (contactid, firstname, lastname) OUTPUT inserted.accountnumber VALUES ('2f4941ec-2f6f-4c7f-8adc-c6f4fb002d42', 'albert', 'einstein');
UPDATE contact SET lastname = 'Johnson' WHERE contactid = '3a4941ec-2f6f-4c7f-8adc-c6f4fb002d42';
DELETE FROM contact WHERE contactid = '4b4941ec-2f6f-4c7f-8adc-c6f4fb002d42'
```

The first command in that batch of SQL commands is this:

```sql 
INSERT INTO contact (contactid, firstname, lastname) OUTPUT inserted.accountnumber VALUES ('2f4941ec-2f6f-4c7f-8adc-c6f4fb002d42', 'albert', 'einstein');
```

And we know that this actually equates to 2 seperate RequestMessages, a CreateRequest and a RetrieveRequest. We then also need to do an Update and a then a Delete. So this equates to:

An ExecuteMultipleRequest (ContinueOnError = false)

Containing:

<ol>
  <li>A CreateRequestMessage (to insert / create the contact) 
  </li>
  <li>A RetrieveRequestMessage - to retrieve the "accountnumber" of the created entity.</li>
  <li>An UpdateRequestMessage</li>
  <li>A DeleteRequestMessage</li>
</ol>

Ok good so far!

### Should look at Boat Breakdown cover
Now consider this one:

```sql
INSERT INTO contact (firstname, lastname) OUTPUT inserted.accountnumber VALUES ('albert', 'einstein');
GO
DELETE FROM contact WHERE contactid = '6f4941ec-2f6f-4c7f-8adc-c6f4fb002d42'
```

What this says is:

1. We want to Insert a Contact, output its account number. 
2. Then in a second "batch" of sql statements - we want to Delete a contact. The second batch needs to execute regardless of any problem or outcome from the first batch - (The GO keyword is used as a batch seperator in T-SQL)

What this translates into is:

1. A CreateRequest that allways needs to be executed.
2. A RetreiveRequest (to retrieve the "accountnumber") which should only be executed if the preceeding CreateRequest succeeds.
3. A DeleteRequest that allways needs to be executed.

Can we construct the equivalent ExecuteMultipleRequest to do that?

Well.. the answer is.. we can semantically construct an appropriate ExecuteMultipleRequest, but it won't be supported by CRM - because you are not allowed to nest ExecuteMultipleRequest - if you do the CRM server will throw an error when you send it such a request.

Here is what that looks like though (if only it was supported by the server!)

1. An ExecuteMultipleRequest (ContinueOnError = true) Containing:
    1. An ExecuteMultipleRequest (ContinueOnError = false) Containing:
        1. A CreateRequest to create the contact
        2. A RetrieveRequestMessage - to retrieve the "accountnumber" of created entity 
    2. A DeleteRequestMessage
    
As I say, constructing such a Request is possible, but the CRM server won't process it due to current runtime limitations that are imposed about not allowing nested ExecuteMultipleRequests.

So - unfortunately we have hit a CRM limitation here.

But what you could do, is, on the client side, split that SQL statement on the `GO` keyword, to get each `batch` of T-SQL commands. Then for each batch, construct and send an appropriate ExecuteMultipleRequest for the statements in that batch.

### What have we learned so far

The ExecuteMultipleRequest provides the ability to send a single "batch" of commands to the server. Thinking from a SQL perspective, this is akin to sending all the statements upto a "GO" keyword (batch seperator). To get the same behaviour as SQL though, you should set `ContinueOnError` to false - so that processing halts if any request in the batch errors.

The ExecuteMultipleRequest is not a good fit for sending multiple individual `batches` of operations to the CRM server, as there is no way to group the Requests within a ExecuteMultipleRequest into their batches. For this reason it's probably best to think of ExecuteMultipleRequest as a single SQL batch and to always use `ContinueOnError` = false if you want to mirror the behaviour of SQL as closely as possible.

## A weird scenario - can send multiple batches in one go - as long as each batch contains 1 RequestMessage only.

Consider the following T-SQL:

```sql
INSERT INTO contact (firstname, lastname) VALUES ('albert', 'einstein');
GO
DELETE FROM contact WHERE contactid = '6f4941ec-2f6f-4c7f-8adc-c6f4fb002d42';
GO
UPDATE contact SET firstname = 'bob' WHERE lastname = 'Hoskins';
GO
```

In this scenario - each batch of commands contains only a single command. What this means is that you can construct an ExecuteMultipleRequest with 'ContinueOnError' set to true, and there will be no danger that a particular command in a batch will error, and that the rest of the commands in that batch will execute regardless - because there is only a single command in each batch!

For an example of the danger I am referring to here, consider this:

```sql
DELETE FROM contact WHERE contactid = '6f4941ec-2f6f-4c7f-8adc-c6f4fb002d42';
DELETE FROM account WHERE primarycontactid = '6f4941ec-2f6f-4c7f-8adc-c6f4fb002d42';
GO
UPDATE contact SET firstname = 'bob' WHERE lastname = 'Hoskins';
GO
```

The first batch above, contains 2 operations. The second batch contains 1.

Now imagine, that for the above - we constructed an ExecuteMultipleRequest, and set 'ContinueOnError' to true (to enable the server to process both batches regardless of whether the first batch fails.)
Well in that scenario, because the first batch actually contains 2 operations, the 'ContinueOnError' = true would actually apply to each operation within that batch as well. So you could hit a scenario where the first Delete in that first batch errored, but then CRM continued on regardless to execute the second DELETE etc. This is not what the semantics of the above SQL query conveys - i.e the equivalent CRM beahviour for the above SQL query would be for it to stop processing a particular batch as soon as it hits an error. The only way this can be satisfied at present is if each batch only contains a single RequestMessage.

### Conclusion
If you would like to send a batch of commands to the CRM server in one go, the good news is you can. The bad news is, it's not perfect, there are limitations, and hopefully I have shown you just about how far you can stretch things.

If you need to send multiple batches of commands to the CRM server in one go, the good news is you can if each batch contains only a single request message (i.e Create, Retreive, Delete, Update etc) - the bad news is, if thats not the case, then you will need to send each batch as an individual ExecuteMultipleRequest, and implement your own "ContinueOnError" behaviour clientside such that should one ExecuteMultipleRequest fail to be processed it doesn't halt subsequent batches (ExecuteMultipleRequests) from being processed.