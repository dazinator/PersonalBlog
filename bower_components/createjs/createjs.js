/*!
 * @license EaselJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011-2015 gskinner.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
this.createjs = this.createjs || {}, createjs.extend = function(a, b) {
        "use strict";

        function c() {
            this.constructor = a
        }
        return c.prototype = b.prototype, a.prototype = new c
    }, this.createjs = this.createjs || {}, createjs.promote = function(a, b) {
        "use strict";
        var c = a.prototype,
            d = Object.getPrototypeOf && Object.getPrototypeOf(c) || c.__proto__;
        if (d) {
            c[(b += "_") + "constructor"] = d.constructor;
            for (var e in d) c.hasOwnProperty(e) && "function" == typeof d[e] && (c[b + e] = d[e])
        }
        return a
    }, this.createjs = this.createjs || {}, createjs.indexOf = function(a, b) {
        "use strict";
        for (var c = 0, d = a.length; d > c; c++)
            if (b === a[c]) return c;
        return -1
    }, this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.type = a, this.target = null, this.currentTarget = null, this.eventPhase = 0, this.bubbles = !!b, this.cancelable = !!c, this.timeStamp = (new Date).getTime(), this.defaultPrevented = !1, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.removed = !1
        }
        var b = a.prototype;
        b.preventDefault = function() {
            this.defaultPrevented = this.cancelable && !0
        }, b.stopPropagation = function() {
            this.propagationStopped = !0
        }, b.stopImmediatePropagation = function() {
            this.immediatePropagationStopped = this.propagationStopped = !0
        }, b.remove = function() {
            this.removed = !0
        }, b.clone = function() {
            return new a(this.type, this.bubbles, this.cancelable)
        }, b.set = function(a) {
            for (var b in a) this[b] = a[b];
            return this
        }, b.toString = function() {
            return "[Event (type=" + this.type + ")]"
        }, createjs.Event = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            this._listeners = null, this._captureListeners = null
        }
        var b = a.prototype;
        a.initialize = function(a) {
            a.addEventListener = b.addEventListener, a.on = b.on, a.removeEventListener = a.off = b.removeEventListener, a.removeAllEventListeners = b.removeAllEventListeners, a.hasEventListener = b.hasEventListener, a.dispatchEvent = b.dispatchEvent, a._dispatchEvent = b._dispatchEvent, a.willTrigger = b.willTrigger
        }, b.addEventListener = function(a, b, c) {
            var d;
            d = c ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
            var e = d[a];
            return e && this.removeEventListener(a, b, c), e = d[a], e ? e.push(b) : d[a] = [b], b
        }, b.on = function(a, b, c, d, e, f) {
            return b.handleEvent && (c = c || b, b = b.handleEvent), c = c || this, this.addEventListener(a, function(a) {
                b.call(c, a, e), d && a.remove()
            }, f)
        }, b.removeEventListener = function(a, b, c) {
            var d = c ? this._captureListeners : this._listeners;
            if (d) {
                var e = d[a];
                if (e)
                    for (var f = 0, g = e.length; g > f; f++)
                        if (e[f] == b) {
                            1 == g ? delete d[a] : e.splice(f, 1);
                            break
                        }
            }
        }, b.off = b.removeEventListener, b.removeAllEventListeners = function(a) {
            a ? (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
        }, b.dispatchEvent = function(a, b, c) {
            if ("string" == typeof a) {
                var d = this._listeners;
                if (!(b || d && d[a])) return !0;
                a = new createjs.Event(a, b, c)
            } else a.target && a.clone && (a = a.clone());
            try {
                a.target = this
            } catch (e) {}
            if (a.bubbles && this.parent) {
                for (var f = this, g = [f]; f.parent;) g.push(f = f.parent);
                var h, i = g.length;
                for (h = i - 1; h >= 0 && !a.propagationStopped; h--) g[h]._dispatchEvent(a, 1 + (0 == h));
                for (h = 1; i > h && !a.propagationStopped; h++) g[h]._dispatchEvent(a, 3)
            } else this._dispatchEvent(a, 2);
            return !a.defaultPrevented
        }, b.hasEventListener = function(a) {
            var b = this._listeners,
                c = this._captureListeners;
            return !!(b && b[a] || c && c[a])
        }, b.willTrigger = function(a) {
            for (var b = this; b;) {
                if (b.hasEventListener(a)) return !0;
                b = b.parent
            }
            return !1
        }, b.toString = function() {
            return "[EventDispatcher]"
        }, b._dispatchEvent = function(a, b) {
            var c, d = 1 == b ? this._captureListeners : this._listeners;
            if (a && d) {
                var e = d[a.type];
                if (!e || !(c = e.length)) return;
                try {
                    a.currentTarget = this
                } catch (f) {}
                try {
                    a.eventPhase = b
                } catch (f) {}
                a.removed = !1, e = e.slice();
                for (var g = 0; c > g && !a.immediatePropagationStopped; g++) {
                    var h = e[g];
                    h.handleEvent ? h.handleEvent(a) : h(a), a.removed && (this.off(a.type, h, 1 == b), a.removed = !1)
                }
            }
        }, createjs.EventDispatcher = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            throw "Ticker cannot be instantiated."
        }
        a.RAF_SYNCHED = "synched", a.RAF = "raf", a.TIMEOUT = "timeout", a.useRAF = !1, a.timingMode = null, a.maxDelta = 0, a.paused = !1, a.removeEventListener = null, a.removeAllEventListeners = null, a.dispatchEvent = null, a.hasEventListener = null, a._listeners = null, createjs.EventDispatcher.initialize(a), a._addEventListener = a.addEventListener, a.addEventListener = function() {
            return !a._inited && a.init(), a._addEventListener.apply(a, arguments)
        }, a._inited = !1, a._startTime = 0, a._pausedTime = 0, a._ticks = 0, a._pausedTicks = 0, a._interval = 50, a._lastTime = 0, a._times = null, a._tickTimes = null, a._timerId = null, a._raf = !0, a.setInterval = function(b) {
            a._interval = b, a._inited && a._setupTick()
        }, a.getInterval = function() {
            return a._interval
        }, a.setFPS = function(b) {
            a.setInterval(1e3 / b)
        }, a.getFPS = function() {
            return 1e3 / a._interval
        };
        try {
            Object.defineProperties(a, {
                interval: {
                    get: a.getInterval,
                    set: a.setInterval
                },
                framerate: {
                    get: a.getFPS,
                    set: a.setFPS
                }
            })
        } catch (b) {
            console.log(b)
        }
        a.init = function() {
            a._inited || (a._inited = !0, a._times = [], a._tickTimes = [], a._startTime = a._getTime(), a._times.push(a._lastTime = 0), a.interval = a._interval)
        }, a.reset = function() {
            if (a._raf) {
                var b = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
                b && b(a._timerId)
            } else clearTimeout(a._timerId);
            a.removeAllEventListeners("tick"), a._timerId = a._times = a._tickTimes = null, a._startTime = a._lastTime = a._ticks = 0, a._inited = !1
        }, a.getMeasuredTickTime = function(b) {
            var c = 0,
                d = a._tickTimes;
            if (!d || d.length < 1) return -1;
            b = Math.min(d.length, b || 0 | a.getFPS());
            for (var e = 0; b > e; e++) c += d[e];
            return c / b
        }, a.getMeasuredFPS = function(b) {
            var c = a._times;
            return !c || c.length < 2 ? -1 : (b = Math.min(c.length - 1, b || 0 | a.getFPS()), 1e3 / ((c[0] - c[b]) / b))
        }, a.setPaused = function(b) {
            a.paused = b
        }, a.getPaused = function() {
            return a.paused
        }, a.getTime = function(b) {
            return a._startTime ? a._getTime() - (b ? a._pausedTime : 0) : -1
        }, a.getEventTime = function(b) {
            return a._startTime ? (a._lastTime || a._startTime) - (b ? a._pausedTime : 0) : -1
        }, a.getTicks = function(b) {
            return a._ticks - (b ? a._pausedTicks : 0)
        }, a._handleSynch = function() {
            a._timerId = null, a._setupTick(), a._getTime() - a._lastTime >= .97 * (a._interval - 1) && a._tick()
        }, a._handleRAF = function() {
            a._timerId = null, a._setupTick(), a._tick()
        }, a._handleTimeout = function() {
            a._timerId = null, a._setupTick(), a._tick()
        }, a._setupTick = function() {
            if (null == a._timerId) {
                var b = a.timingMode || a.useRAF && a.RAF_SYNCHED;
                if (b == a.RAF_SYNCHED || b == a.RAF) {
                    var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                    if (c) return a._timerId = c(b == a.RAF ? a._handleRAF : a._handleSynch), void(a._raf = !0)
                }
                a._raf = !1, a._timerId = setTimeout(a._handleTimeout, a._interval)
            }
        }, a._tick = function() {
            var b = a.paused,
                c = a._getTime(),
                d = c - a._lastTime;
            if (a._lastTime = c, a._ticks++, b && (a._pausedTicks++, a._pausedTime += d), a.hasEventListener("tick")) {
                var e = new createjs.Event("tick"),
                    f = a.maxDelta;
                e.delta = f && d > f ? f : d, e.paused = b, e.time = c, e.runTime = c - a._pausedTime, a.dispatchEvent(e)
            }
            for (a._tickTimes.unshift(a._getTime() - c); a._tickTimes.length > 100;) a._tickTimes.pop();
            for (a._times.unshift(c); a._times.length > 100;) a._times.pop()
        };
        var c = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
        a._getTime = function() {
            return (c && c.call(performance) || (new Date).getTime()) - a._startTime
        }, createjs.Ticker = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            throw "UID cannot be instantiated"
        }
        a._nextID = 0, a.get = function() {
            return a._nextID++
        }, createjs.UID = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d, e, f, g, h, i, j, k) {
            this.Event_constructor(a, b, c), this.stageX = d, this.stageY = e, this.rawX = null == i ? d : i, this.rawY = null == j ? e : j, this.nativeEvent = f, this.pointerID = g, this.primary = !!h, this.relatedTarget = k
        }
        var b = createjs.extend(a, createjs.Event);
        b._get_localX = function() {
            return this.currentTarget.globalToLocal(this.rawX, this.rawY).x
        }, b._get_localY = function() {
            return this.currentTarget.globalToLocal(this.rawX, this.rawY).y
        }, b._get_isTouch = function() {
            return -1 !== this.pointerID
        };
        try {
            Object.defineProperties(b, {
                localX: {
                    get: b._get_localX
                },
                localY: {
                    get: b._get_localY
                },
                isTouch: {
                    get: b._get_isTouch
                }
            })
        } catch (c) {}
        b.clone = function() {
            return new a(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
        }, b.toString = function() {
            return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
        }, createjs.MouseEvent = createjs.promote(a, "Event")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d, e, f) {
            this.setValues(a, b, c, d, e, f)
        }
        var b = a.prototype;
        a.DEG_TO_RAD = Math.PI / 180, a.identity = null, b.setValues = function(a, b, c, d, e, f) {
            return this.a = null == a ? 1 : a, this.b = b || 0, this.c = c || 0, this.d = null == d ? 1 : d, this.tx = e || 0, this.ty = f || 0, this
        }, b.append = function(a, b, c, d, e, f) {
            var g = this.a,
                h = this.b,
                i = this.c,
                j = this.d;
            return (1 != a || 0 != b || 0 != c || 1 != d) && (this.a = g * a + i * b, this.b = h * a + j * b, this.c = g * c + i * d, this.d = h * c + j * d), this.tx = g * e + i * f + this.tx, this.ty = h * e + j * f + this.ty, this
        }, b.prepend = function(a, b, c, d, e, f) {
            var g = this.a,
                h = this.c,
                i = this.tx;
            return this.a = a * g + c * this.b, this.b = b * g + d * this.b, this.c = a * h + c * this.d, this.d = b * h + d * this.d, this.tx = a * i + c * this.ty + e, this.ty = b * i + d * this.ty + f, this
        }, b.appendMatrix = function(a) {
            return this.append(a.a, a.b, a.c, a.d, a.tx, a.ty)
        }, b.prependMatrix = function(a) {
            return this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty)
        }, b.appendTransform = function(b, c, d, e, f, g, h, i, j) {
            if (f % 360) var k = f * a.DEG_TO_RAD,
                l = Math.cos(k),
                m = Math.sin(k);
            else l = 1, m = 0;
            return g || h ? (g *= a.DEG_TO_RAD, h *= a.DEG_TO_RAD, this.append(Math.cos(h), Math.sin(h), -Math.sin(g), Math.cos(g), b, c), this.append(l * d, m * d, -m * e, l * e, 0, 0)) : this.append(l * d, m * d, -m * e, l * e, b, c), (i || j) && (this.tx -= i * this.a + j * this.c, this.ty -= i * this.b + j * this.d), this
        }, b.prependTransform = function(b, c, d, e, f, g, h, i, j) {
            if (f % 360) var k = f * a.DEG_TO_RAD,
                l = Math.cos(k),
                m = Math.sin(k);
            else l = 1, m = 0;
            return (i || j) && (this.tx -= i, this.ty -= j), g || h ? (g *= a.DEG_TO_RAD, h *= a.DEG_TO_RAD, this.prepend(l * d, m * d, -m * e, l * e, 0, 0), this.prepend(Math.cos(h), Math.sin(h), -Math.sin(g), Math.cos(g), b, c)) : this.prepend(l * d, m * d, -m * e, l * e, b, c), this
        }, b.rotate = function(b) {
            b *= a.DEG_TO_RAD;
            var c = Math.cos(b),
                d = Math.sin(b),
                e = this.a,
                f = this.b;
            return this.a = e * c + this.c * d, this.b = f * c + this.d * d, this.c = -e * d + this.c * c, this.d = -f * d + this.d * c, this
        }, b.skew = function(b, c) {
            return b *= a.DEG_TO_RAD, c *= a.DEG_TO_RAD, this.append(Math.cos(c), Math.sin(c), -Math.sin(b), Math.cos(b), 0, 0), this
        }, b.scale = function(a, b) {
            return this.a *= a, this.b *= a, this.c *= b, this.d *= b, this
        }, b.translate = function(a, b) {
            return this.tx += this.a * a + this.c * b, this.ty += this.b * a + this.d * b, this
        }, b.identity = function() {
            return this.a = this.d = 1, this.b = this.c = this.tx = this.ty = 0, this
        }, b.invert = function() {
            var a = this.a,
                b = this.b,
                c = this.c,
                d = this.d,
                e = this.tx,
                f = a * d - b * c;
            return this.a = d / f, this.b = -b / f, this.c = -c / f, this.d = a / f, this.tx = (c * this.ty - d * e) / f, this.ty = -(a * this.ty - b * e) / f, this
        }, b.isIdentity = function() {
            return 0 === this.tx && 0 === this.ty && 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d
        }, b.equals = function(a) {
            return this.tx === a.tx && this.ty === a.ty && this.a === a.a && this.b === a.b && this.c === a.c && this.d === a.d
        }, b.transformPoint = function(a, b, c) {
            return c = c || {}, c.x = a * this.a + b * this.c + this.tx, c.y = a * this.b + b * this.d + this.ty, c
        }, b.decompose = function(b) {
            null == b && (b = {}), b.x = this.tx, b.y = this.ty, b.scaleX = Math.sqrt(this.a * this.a + this.b * this.b), b.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
            var c = Math.atan2(-this.c, this.d),
                d = Math.atan2(this.b, this.a),
                e = Math.abs(1 - c / d);
            return 1e-5 > e ? (b.rotation = d / a.DEG_TO_RAD, this.a < 0 && this.d >= 0 && (b.rotation += b.rotation <= 0 ? 180 : -180), b.skewX = b.skewY = 0) : (b.skewX = c / a.DEG_TO_RAD, b.skewY = d / a.DEG_TO_RAD), b
        }, b.copy = function(a) {
            return this.setValues(a.a, a.b, a.c, a.d, a.tx, a.ty)
        }, b.clone = function() {
            return new a(this.a, this.b, this.c, this.d, this.tx, this.ty)
        }, b.toString = function() {
            return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
        }, a.identity = new a, createjs.Matrix2D = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d, e) {
            this.setValues(a, b, c, d, e)
        }
        var b = a.prototype;
        b.setValues = function(a, b, c, d, e) {
            return this.visible = null == a ? !0 : !!a, this.alpha = null == b ? 1 : b, this.shadow = c, this.compositeOperation = d, this.matrix = e || this.matrix && this.matrix.identity() || new createjs.Matrix2D, this
        }, b.append = function(a, b, c, d, e) {
            return this.alpha *= b, this.shadow = c || this.shadow, this.compositeOperation = d || this.compositeOperation, this.visible = this.visible && a, e && this.matrix.appendMatrix(e), this
        }, b.prepend = function(a, b, c, d, e) {
            return this.alpha *= b, this.shadow = this.shadow || c, this.compositeOperation = this.compositeOperation || d, this.visible = this.visible && a, e && this.matrix.prependMatrix(e), this
        }, b.identity = function() {
            return this.visible = !0, this.alpha = 1, this.shadow = this.compositeOperation = null, this.matrix.identity(), this
        }, b.clone = function() {
            return new a(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone())
        }, createjs.DisplayProps = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.setValues(a, b)
        }
        var b = a.prototype;
        b.setValues = function(a, b) {
            return this.x = a || 0, this.y = b || 0, this
        }, b.copy = function(a) {
            return this.x = a.x, this.y = a.y, this
        }, b.clone = function() {
            return new a(this.x, this.y)
        }, b.toString = function() {
            return "[Point (x=" + this.x + " y=" + this.y + ")]"
        }, createjs.Point = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d) {
            this.setValues(a, b, c, d)
        }
        var b = a.prototype;
        b.setValues = function(a, b, c, d) {
            return this.x = a || 0, this.y = b || 0, this.width = c || 0, this.height = d || 0, this
        }, b.extend = function(a, b, c, d) {
            return c = c || 0, d = d || 0, a + c > this.x + this.width && (this.width = a + c - this.x), b + d > this.y + this.height && (this.height = b + d - this.y), a < this.x && (this.width += this.x - a, this.x = a), b < this.y && (this.height += this.y - b, this.y = b), this
        }, b.pad = function(a, b, c, d) {
            return this.x -= b, this.y -= a, this.width += b + d, this.height += a + c, this
        }, b.copy = function(a) {
            return this.setValues(a.x, a.y, a.width, a.height)
        }, b.contains = function(a, b, c, d) {
            return c = c || 0, d = d || 0, a >= this.x && a + c <= this.x + this.width && b >= this.y && b + d <= this.y + this.height
        }, b.union = function(a) {
            return this.clone().extend(a.x, a.y, a.width, a.height)
        }, b.intersection = function(b) {
            var c = b.x,
                d = b.y,
                e = c + b.width,
                f = d + b.height;
            return this.x > c && (c = this.x), this.y > d && (d = this.y), this.x + this.width < e && (e = this.x + this.width), this.y + this.height < f && (f = this.y + this.height), c >= e || d >= f ? null : new a(c, d, e - c, f - d)
        }, b.intersects = function(a) {
            return a.x <= this.x + this.width && this.x <= a.x + a.width && a.y <= this.y + this.height && this.y <= a.y + a.height
        }, b.isEmpty = function() {
            return this.width <= 0 || this.height <= 0
        }, b.clone = function() {
            return new a(this.x, this.y, this.width, this.height)
        }, b.toString = function() {
            return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
        }, createjs.Rectangle = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d, e, f, g) {
            a.addEventListener && (this.target = a, this.overLabel = null == c ? "over" : c, this.outLabel = null == b ? "out" : b, this.downLabel = null == d ? "down" : d, this.play = e, this._isPressed = !1, this._isOver = !1, this._enabled = !1, a.mouseChildren = !1, this.enabled = !0, this.handleEvent({}), f && (g && (f.actionsEnabled = !1, f.gotoAndStop && f.gotoAndStop(g)), a.hitArea = f))
        }
        var b = a.prototype;
        b.setEnabled = function(a) {
            if (a != this._enabled) {
                var b = this.target;
                this._enabled = a, a ? (b.cursor = "pointer", b.addEventListener("rollover", this), b.addEventListener("rollout", this), b.addEventListener("mousedown", this), b.addEventListener("pressup", this), b._reset && (b.__reset = b._reset, b._reset = this._reset)) : (b.cursor = null, b.removeEventListener("rollover", this), b.removeEventListener("rollout", this), b.removeEventListener("mousedown", this), b.removeEventListener("pressup", this), b.__reset && (b._reset = b.__reset, delete b.__reset))
            }
        }, b.getEnabled = function() {
            return this._enabled
        };
        try {
            Object.defineProperties(b, {
                enabled: {
                    get: b.getEnabled,
                    set: b.setEnabled
                }
            })
        } catch (c) {}
        b.toString = function() {
            return "[ButtonHelper]"
        }, b.handleEvent = function(a) {
            var b, c = this.target,
                d = a.type;
            "mousedown" == d ? (this._isPressed = !0, b = this.downLabel) : "pressup" == d ? (this._isPressed = !1, b = this._isOver ? this.overLabel : this.outLabel) : "rollover" == d ? (this._isOver = !0, b = this._isPressed ? this.downLabel : this.overLabel) : (this._isOver = !1, b = this._isPressed ? this.overLabel : this.outLabel), this.play ? c.gotoAndPlay && c.gotoAndPlay(b) : c.gotoAndStop && c.gotoAndStop(b)
        }, b._reset = function() {
            var a = this.paused;
            this.__reset(), this.paused = a
        }, createjs.ButtonHelper = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d) {
            this.color = a || "black", this.offsetX = b || 0, this.offsetY = c || 0, this.blur = d || 0
        }
        var b = a.prototype;
        a.identity = new a("transparent", 0, 0, 0), b.toString = function() {
            return "[Shadow]"
        }, b.clone = function() {
            return new a(this.color, this.offsetX, this.offsetY, this.blur)
        }, createjs.Shadow = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.EventDispatcher_constructor(), this.complete = !0, this.framerate = 0, this._animations = null, this._frames = null, this._images = null, this._data = null, this._loadCount = 0, this._frameHeight = 0, this._frameWidth = 0, this._numFrames = 0, this._regX = 0, this._regY = 0, this._spacing = 0, this._margin = 0, this._parseData(a)
        }
        var b = createjs.extend(a, createjs.EventDispatcher);
        b.getAnimations = function() {
            return this._animations.slice()
        };
        try {
            Object.defineProperties(b, {
                animations: {
                    get: b.getAnimations
                }
            })
        } catch (c) {}
        b.getNumFrames = function(a) {
            if (null == a) return this._frames ? this._frames.length : this._numFrames || 0;
            var b = this._data[a];
            return null == b ? 0 : b.frames.length
        }, b.getAnimation = function(a) {
            return this._data[a]
        }, b.getFrame = function(a) {
            var b;
            return this._frames && (b = this._frames[a]) ? b : null
        }, b.getFrameBounds = function(a, b) {
            var c = this.getFrame(a);
            return c ? (b || new createjs.Rectangle).setValues(-c.regX, -c.regY, c.rect.width, c.rect.height) : null
        }, b.toString = function() {
            return "[SpriteSheet]"
        }, b.clone = function() {
            throw "SpriteSheet cannot be cloned."
        }, b._parseData = function(a) {
            var b, c, d, e;
            if (null != a) {
                if (this.framerate = a.framerate || 0, a.images && (c = a.images.length) > 0)
                    for (e = this._images = [], b = 0; c > b; b++) {
                        var f = a.images[b];
                        if ("string" == typeof f) {
                            var g = f;
                            f = document.createElement("img"), f.src = g
                        }
                        e.push(f), f.getContext || f.naturalWidth || (this._loadCount++, this.complete = !1, function(a, b) {
                            f.onload = function() {
                                a._handleImageLoad(b)
                            }
                        }(this, g), function(a, b) {
                            f.onerror = function() {
                                a._handleImageError(b)
                            }
                        }(this, g))
                    }
                if (null == a.frames);
                else if (Array.isArray(a.frames))
                    for (this._frames = [], e = a.frames, b = 0, c = e.length; c > b; b++) {
                        var h = e[b];
                        this._frames.push({
                            image: this._images[h[4] ? h[4] : 0],
                            rect: new createjs.Rectangle(h[0], h[1], h[2], h[3]),
                            regX: h[5] || 0,
                            regY: h[6] || 0
                        })
                    } else d = a.frames, this._frameWidth = d.width, this._frameHeight = d.height, this._regX = d.regX || 0, this._regY = d.regY || 0, this._spacing = d.spacing || 0, this._margin = d.margin || 0, this._numFrames = d.count, 0 == this._loadCount && this._calculateFrames();
                if (this._animations = [], null != (d = a.animations)) {
                    this._data = {};
                    var i;
                    for (i in d) {
                        var j = {
                                name: i
                            },
                            k = d[i];
                        if ("number" == typeof k) e = j.frames = [k];
                        else if (Array.isArray(k))
                            if (1 == k.length) j.frames = [k[0]];
                            else
                                for (j.speed = k[0], j.next = k[0], e = j.frames = [], b = k[0]; b <= k[1]; b++) e.push(b);
                        else {
                            j.speed = k.speed, j.next = k.next;
                            var l = k.frames;
                            e = j.frames = "number" == typeof l ? [l] : l.slice(0)
                        }(j.next === !0 || void 0 === j.next) && (j.next = i), (j.next === !1 || e.length < 2 && j.next == i) && (j.next = null), j.speed || (j.speed = 0), this._animations.push(i), this._data[i] = j
                    }
                }
            }
        }, b._handleImageLoad = function() {
            0 == --this._loadCount && (this._calculateFrames(), this.complete = !0, this.dispatchEvent("complete"))
        }, b._handleImageError = function(a) {
            var b = new createjs.Event("error");
            b.src = a, this.dispatchEvent(b), 0 == --this._loadCount && this.dispatchEvent("complete")
        }, b._calculateFrames = function() {
            if (!this._frames && 0 != this._frameWidth) {
                this._frames = [];
                var a = this._numFrames || 1e5,
                    b = 0,
                    c = this._frameWidth,
                    d = this._frameHeight,
                    e = this._spacing,
                    f = this._margin;
                a: for (var g = 0, h = this._images; g < h.length; g++)
                    for (var i = h[g], j = i.width, k = i.height, l = f; k - f - d >= l;) {
                        for (var m = f; j - f - c >= m;) {
                            if (b >= a) break a;
                            b++, this._frames.push({
                                image: i,
                                rect: new createjs.Rectangle(m, l, c, d),
                                regX: this._regX,
                                regY: this._regY
                            }), m += c + e
                        }
                        l += d + e
                    }
                this._numFrames = b
            }
        }, createjs.SpriteSheet = createjs.promote(a, "EventDispatcher")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            this.command = null, this._stroke = null, this._strokeStyle = null, this._oldStrokeStyle = null, this._strokeDash = null, this._oldStrokeDash = null, this._strokeIgnoreScale = !1, this._fill = null, this._instructions = [], this._commitIndex = 0, this._activeInstructions = [], this._dirty = !1, this._storeIndex = 0, this.clear()
        }
        var b = a.prototype,
            c = a;
        a.getRGB = function(a, b, c, d) {
            return null != a && null == c && (d = b, c = 255 & a, b = a >> 8 & 255, a = a >> 16 & 255), null == d ? "rgb(" + a + "," + b + "," + c + ")" : "rgba(" + a + "," + b + "," + c + "," + d + ")"
        }, a.getHSL = function(a, b, c, d) {
            return null == d ? "hsl(" + a % 360 + "," + b + "%," + c + "%)" : "hsla(" + a % 360 + "," + b + "%," + c + "%," + d + ")"
        }, a.BASE_64 = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
            G: 6,
            H: 7,
            I: 8,
            J: 9,
            K: 10,
            L: 11,
            M: 12,
            N: 13,
            O: 14,
            P: 15,
            Q: 16,
            R: 17,
            S: 18,
            T: 19,
            U: 20,
            V: 21,
            W: 22,
            X: 23,
            Y: 24,
            Z: 25,
            a: 26,
            b: 27,
            c: 28,
            d: 29,
            e: 30,
            f: 31,
            g: 32,
            h: 33,
            i: 34,
            j: 35,
            k: 36,
            l: 37,
            m: 38,
            n: 39,
            o: 40,
            p: 41,
            q: 42,
            r: 43,
            s: 44,
            t: 45,
            u: 46,
            v: 47,
            w: 48,
            x: 49,
            y: 50,
            z: 51,
            0: 52,
            1: 53,
            2: 54,
            3: 55,
            4: 56,
            5: 57,
            6: 58,
            7: 59,
            8: 60,
            9: 61,
            "+": 62,
            "/": 63
        }, a.STROKE_CAPS_MAP = ["butt", "round", "square"], a.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
        var d = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        d.getContext && (a._ctx = d.getContext("2d"), d.width = d.height = 1), b.getInstructions = function() {
            return this._updateInstructions(), this._instructions
        };
        try {
            Object.defineProperties(b, {
                instructions: {
                    get: b.getInstructions
                }
            })
        } catch (e) {}
        b.isEmpty = function() {
            return !(this._instructions.length || this._activeInstructions.length)
        }, b.draw = function(a, b) {
            this._updateInstructions();
            for (var c = this._instructions, d = this._storeIndex, e = c.length; e > d; d++) c[d].exec(a, b)
        }, b.drawAsPath = function(a) {
            this._updateInstructions();
            for (var b, c = this._instructions, d = this._storeIndex, e = c.length; e > d; d++)(b = c[d]).path !== !1 && b.exec(a)
        }, b.moveTo = function(a, b) {
            return this.append(new c.MoveTo(a, b), !0)
        }, b.lineTo = function(a, b) {
            return this.append(new c.LineTo(a, b))
        }, b.arcTo = function(a, b, d, e, f) {
            return this.append(new c.ArcTo(a, b, d, e, f))
        }, b.arc = function(a, b, d, e, f, g) {
            return this.append(new c.Arc(a, b, d, e, f, g))
        }, b.quadraticCurveTo = function(a, b, d, e) {
            return this.append(new c.QuadraticCurveTo(a, b, d, e))
        }, b.bezierCurveTo = function(a, b, d, e, f, g) {
            return this.append(new c.BezierCurveTo(a, b, d, e, f, g))
        }, b.rect = function(a, b, d, e) {
            return this.append(new c.Rect(a, b, d, e))
        }, b.closePath = function() {
            return this._activeInstructions.length ? this.append(new c.ClosePath) : this
        }, b.clear = function() {
            return this._instructions.length = this._activeInstructions.length = this._commitIndex = 0, this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null, this._dirty = this._strokeIgnoreScale = !1, this
        }, b.beginFill = function(a) {
            return this._setFill(a ? new c.Fill(a) : null)
        }, b.beginLinearGradientFill = function(a, b, d, e, f, g) {
            return this._setFill((new c.Fill).linearGradient(a, b, d, e, f, g))
        }, b.beginRadialGradientFill = function(a, b, d, e, f, g, h, i) {
            return this._setFill((new c.Fill).radialGradient(a, b, d, e, f, g, h, i))
        }, b.beginBitmapFill = function(a, b, d) {
            return this._setFill(new c.Fill(null, d).bitmap(a, b))
        }, b.endFill = function() {
            return this.beginFill()
        }, b.setStrokeStyle = function(a, b, d, e, f) {
            return this._updateInstructions(!0), this._strokeStyle = this.command = new c.StrokeStyle(a, b, d, e, f), this._stroke && (this._stroke.ignoreScale = f), this._strokeIgnoreScale = f, this
        }, b.setStrokeDash = function(a, b) {
            return this._updateInstructions(!0), this._strokeDash = this.command = new c.StrokeDash(a, b), this
        }, b.beginStroke = function(a) {
            return this._setStroke(a ? new c.Stroke(a) : null)
        }, b.beginLinearGradientStroke = function(a, b, d, e, f, g) {
            return this._setStroke((new c.Stroke).linearGradient(a, b, d, e, f, g))
        }, b.beginRadialGradientStroke = function(a, b, d, e, f, g, h, i) {
            return this._setStroke((new c.Stroke).radialGradient(a, b, d, e, f, g, h, i))
        }, b.beginBitmapStroke = function(a, b) {
            return this._setStroke((new c.Stroke).bitmap(a, b))
        }, b.endStroke = function() {
            return this.beginStroke()
        }, b.curveTo = b.quadraticCurveTo, b.drawRect = b.rect, b.drawRoundRect = function(a, b, c, d, e) {
            return this.drawRoundRectComplex(a, b, c, d, e, e, e, e)
        }, b.drawRoundRectComplex = function(a, b, d, e, f, g, h, i) {
            return this.append(new c.RoundRect(a, b, d, e, f, g, h, i))
        }, b.drawCircle = function(a, b, d) {
            return this.append(new c.Circle(a, b, d))
        }, b.drawEllipse = function(a, b, d, e) {
            return this.append(new c.Ellipse(a, b, d, e))
        }, b.drawPolyStar = function(a, b, d, e, f, g) {
            return this.append(new c.PolyStar(a, b, d, e, f, g))
        }, b.append = function(a, b) {
            return this._activeInstructions.push(a), this.command = a, b || (this._dirty = !0), this
        }, b.decodePath = function(b) {
            for (var c = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath], d = [2, 2, 4, 6, 0], e = 0, f = b.length, g = [], h = 0, i = 0, j = a.BASE_64; f > e;) {
                var k = b.charAt(e),
                    l = j[k],
                    m = l >> 3,
                    n = c[m];
                if (!n || 3 & l) throw "bad path data (@" + e + "): " + k;
                var o = d[m];
                m || (h = i = 0), g.length = 0, e++;
                for (var p = (l >> 2 & 1) + 2, q = 0; o > q; q++) {
                    var r = j[b.charAt(e)],
                        s = r >> 5 ? -1 : 1;
                    r = (31 & r) << 6 | j[b.charAt(e + 1)], 3 == p && (r = r << 6 | j[b.charAt(e + 2)]), r = s * r / 10, q % 2 ? h = r += h : i = r += i, g[q] = r, e += p
                }
                n.apply(this, g)
            }
            return this
        }, b.store = function() {
            return this._updateInstructions(!0), this._storeIndex = this._instructions.length, this
        }, b.unstore = function() {
            return this._storeIndex = 0, this
        }, b.clone = function() {
            var b = new a;
            return b.command = this.command, b._stroke = this._stroke, b._strokeStyle = this._strokeStyle, b._strokeDash = this._strokeDash, b._strokeIgnoreScale = this._strokeIgnoreScale, b._fill = this._fill, b._instructions = this._instructions.slice(), b._commitIndex = this._commitIndex, b._activeInstructions = this._activeInstructions.slice(), b._dirty = this._dirty, b._storeIndex = this._storeIndex, b
        }, b.toString = function() {
            return "[Graphics]"
        }, b.mt = b.moveTo, b.lt = b.lineTo, b.at = b.arcTo, b.bt = b.bezierCurveTo, b.qt = b.quadraticCurveTo, b.a = b.arc, b.r = b.rect, b.cp = b.closePath, b.c = b.clear, b.f = b.beginFill, b.lf = b.beginLinearGradientFill, b.rf = b.beginRadialGradientFill, b.bf = b.beginBitmapFill, b.ef = b.endFill, b.ss = b.setStrokeStyle, b.sd = b.setStrokeDash, b.s = b.beginStroke, b.ls = b.beginLinearGradientStroke, b.rs = b.beginRadialGradientStroke, b.bs = b.beginBitmapStroke, b.es = b.endStroke, b.dr = b.drawRect, b.rr = b.drawRoundRect, b.rc = b.drawRoundRectComplex, b.dc = b.drawCircle, b.de = b.drawEllipse, b.dp = b.drawPolyStar, b.p = b.decodePath, b._updateInstructions = function(b) {
            var c = this._instructions,
                d = this._activeInstructions,
                e = this._commitIndex;
            if (this._dirty && d.length) {
                c.length = e, c.push(a.beginCmd);
                var f = d.length,
                    g = c.length;
                c.length = g + f;
                for (var h = 0; f > h; h++) c[h + g] = d[h];
                this._fill && c.push(this._fill), this._stroke && (this._strokeDash !== this._oldStrokeDash && (this._oldStrokeDash = this._strokeDash, c.push(this._strokeDash)), this._strokeStyle !== this._oldStrokeStyle && (this._oldStrokeStyle = this._strokeStyle, c.push(this._strokeStyle)), c.push(this._stroke)), this._dirty = !1
            }
            b && (d.length = 0, this._commitIndex = c.length)
        }, b._setFill = function(a) {
            return this._updateInstructions(!0), this.command = this._fill = a, this
        }, b._setStroke = function(a) {
            return this._updateInstructions(!0), (this.command = this._stroke = a) && (a.ignoreScale = this._strokeIgnoreScale), this
        }, (c.LineTo = function(a, b) {
            this.x = a, this.y = b
        }).prototype.exec = function(a) {
            a.lineTo(this.x, this.y)
        }, (c.MoveTo = function(a, b) {
            this.x = a, this.y = b
        }).prototype.exec = function(a) {
            a.moveTo(this.x, this.y)
        }, (c.ArcTo = function(a, b, c, d, e) {
            this.x1 = a, this.y1 = b, this.x2 = c, this.y2 = d, this.radius = e
        }).prototype.exec = function(a) {
            a.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius)
        }, (c.Arc = function(a, b, c, d, e, f) {
            this.x = a, this.y = b, this.radius = c, this.startAngle = d, this.endAngle = e, this.anticlockwise = !!f
        }).prototype.exec = function(a) {
            a.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
        }, (c.QuadraticCurveTo = function(a, b, c, d) {
            this.cpx = a, this.cpy = b, this.x = c, this.y = d
        }).prototype.exec = function(a) {
            a.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y)
        }, (c.BezierCurveTo = function(a, b, c, d, e, f) {
            this.cp1x = a, this.cp1y = b, this.cp2x = c, this.cp2y = d, this.x = e, this.y = f
        }).prototype.exec = function(a) {
            a.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y)
        }, (c.Rect = function(a, b, c, d) {
            this.x = a, this.y = b, this.w = c, this.h = d
        }).prototype.exec = function(a) {
            a.rect(this.x, this.y, this.w, this.h)
        }, (c.ClosePath = function() {}).prototype.exec = function(a) {
            a.closePath()
        }, (c.BeginPath = function() {}).prototype.exec = function(a) {
            a.beginPath()
        }, b = (c.Fill = function(a, b) {
            this.style = a, this.matrix = b
        }).prototype, b.exec = function(a) {
            if (this.style) {
                a.fillStyle = this.style;
                var b = this.matrix;
                b && (a.save(), a.transform(b.a, b.b, b.c, b.d, b.tx, b.ty)), a.fill(), b && a.restore()
            }
        }, b.linearGradient = function(b, c, d, e, f, g) {
            for (var h = this.style = a._ctx.createLinearGradient(d, e, f, g), i = 0, j = b.length; j > i; i++) h.addColorStop(c[i], b[i]);
            return h.props = {
                colors: b,
                ratios: c,
                x0: d,
                y0: e,
                x1: f,
                y1: g,
                type: "linear"
            }, this
        }, b.radialGradient = function(b, c, d, e, f, g, h, i) {
            for (var j = this.style = a._ctx.createRadialGradient(d, e, f, g, h, i), k = 0, l = b.length; l > k; k++) j.addColorStop(c[k], b[k]);
            return j.props = {
                colors: b,
                ratios: c,
                x0: d,
                y0: e,
                r0: f,
                x1: g,
                y1: h,
                r1: i,
                type: "radial"
            }, this
        }, b.bitmap = function(b, c) {
            if (b.naturalWidth || b.getContext || b.readyState >= 2) {
                var d = this.style = a._ctx.createPattern(b, c || "");
                d.props = {
                    image: b,
                    repetition: c,
                    type: "bitmap"
                }
            }
            return this
        }, b.path = !1, b = (c.Stroke = function(a, b) {
            this.style = a, this.ignoreScale = b
        }).prototype, b.exec = function(a) {
            this.style && (a.strokeStyle = this.style, this.ignoreScale && (a.save(), a.setTransform(1, 0, 0, 1, 0, 0)), a.stroke(), this.ignoreScale && a.restore())
        }, b.linearGradient = c.Fill.prototype.linearGradient, b.radialGradient = c.Fill.prototype.radialGradient, b.bitmap = c.Fill.prototype.bitmap, b.path = !1, b = (c.StrokeStyle = function(a, b, c, d, e) {
            this.width = a, this.caps = b, this.joints = c, this.miterLimit = d, this.ignoreScale = e
        }).prototype, b.exec = function(b) {
            b.lineWidth = null == this.width ? "1" : this.width, b.lineCap = null == this.caps ? "butt" : isNaN(this.caps) ? this.caps : a.STROKE_CAPS_MAP[this.caps], b.lineJoin = null == this.joints ? "miter" : isNaN(this.joints) ? this.joints : a.STROKE_JOINTS_MAP[this.joints], b.miterLimit = null == this.miterLimit ? "10" : this.miterLimit, b.ignoreScale = null == this.ignoreScale ? !1 : this.ignoreScale
        }, b.path = !1, (c.StrokeDash = function(a, b) {
            this.segments = a, this.offset = b || 0
        }).prototype.exec = function(a) {
            a.setLineDash && (a.setLineDash(this.segments || c.StrokeDash.EMPTY_SEGMENTS), a.lineDashOffset = this.offset || 0)
        }, c.StrokeDash.EMPTY_SEGMENTS = [], (c.RoundRect = function(a, b, c, d, e, f, g, h) {
            this.x = a, this.y = b, this.w = c, this.h = d, this.radiusTL = e, this.radiusTR = f, this.radiusBR = g, this.radiusBL = h
        }).prototype.exec = function(a) {
            var b = (j > i ? i : j) / 2,
                c = 0,
                d = 0,
                e = 0,
                f = 0,
                g = this.x,
                h = this.y,
                i = this.w,
                j = this.h,
                k = this.radiusTL,
                l = this.radiusTR,
                m = this.radiusBR,
                n = this.radiusBL;
            0 > k && (k *= c = -1), k > b && (k = b), 0 > l && (l *= d = -1), l > b && (l = b), 0 > m && (m *= e = -1), m > b && (m = b), 0 > n && (n *= f = -1), n > b && (n = b), a.moveTo(g + i - l, h), a.arcTo(g + i + l * d, h - l * d, g + i, h + l, l), a.lineTo(g + i, h + j - m), a.arcTo(g + i + m * e, h + j + m * e, g + i - m, h + j, m), a.lineTo(g + n, h + j), a.arcTo(g - n * f, h + j + n * f, g, h + j - n, n), a.lineTo(g, h + k), a.arcTo(g - k * c, h - k * c, g + k, h, k), a.closePath()
        }, (c.Circle = function(a, b, c) {
            this.x = a, this.y = b, this.radius = c
        }).prototype.exec = function(a) {
            a.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        }, (c.Ellipse = function(a, b, c, d) {
            this.x = a, this.y = b, this.w = c, this.h = d
        }).prototype.exec = function(a) {
            var b = this.x,
                c = this.y,
                d = this.w,
                e = this.h,
                f = .5522848,
                g = d / 2 * f,
                h = e / 2 * f,
                i = b + d,
                j = c + e,
                k = b + d / 2,
                l = c + e / 2;
            a.moveTo(b, l), a.bezierCurveTo(b, l - h, k - g, c, k, c), a.bezierCurveTo(k + g, c, i, l - h, i, l), a.bezierCurveTo(i, l + h, k + g, j, k, j), a.bezierCurveTo(k - g, j, b, l + h, b, l)
        }, (c.PolyStar = function(a, b, c, d, e, f) {
            this.x = a, this.y = b, this.radius = c, this.sides = d, this.pointSize = e, this.angle = f
        }).prototype.exec = function(a) {
            var b = this.x,
                c = this.y,
                d = this.radius,
                e = (this.angle || 0) / 180 * Math.PI,
                f = this.sides,
                g = 1 - (this.pointSize || 0),
                h = Math.PI / f;
            a.moveTo(b + Math.cos(e) * d, c + Math.sin(e) * d);
            for (var i = 0; f > i; i++) e += h, 1 != g && a.lineTo(b + Math.cos(e) * d * g, c + Math.sin(e) * d * g), e += h, a.lineTo(b + Math.cos(e) * d, c + Math.sin(e) * d);
            a.closePath()
        }, a.beginCmd = new c.BeginPath, createjs.Graphics = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            this.EventDispatcher_constructor(), this.alpha = 1, this.cacheCanvas = null, this.cacheID = 0, this.id = createjs.UID.get(), this.mouseEnabled = !0, this.tickEnabled = !0, this.name = null, this.parent = null, this.regX = 0, this.regY = 0, this.rotation = 0, this.scaleX = 1, this.scaleY = 1, this.skewX = 0, this.skewY = 0, this.shadow = null, this.visible = !0, this.x = 0, this.y = 0, this.transformMatrix = null, this.compositeOperation = null, this.snapToPixel = !0, this.filters = null, this.mask = null, this.hitArea = null, this.cursor = null, this._cacheOffsetX = 0, this._cacheOffsetY = 0, this._filterOffsetX = 0, this._filterOffsetY = 0, this._cacheScale = 1, this._cacheDataURLID = 0, this._cacheDataURL = null, this._props = new createjs.DisplayProps, this._rectangle = new createjs.Rectangle, this._bounds = null
        }
        var b = createjs.extend(a, createjs.EventDispatcher);
        a._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"], a.suppressCrossDomainErrors = !1, a._snapToPixelEnabled = !1;
        var c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        c.getContext && (a._hitTestCanvas = c, a._hitTestContext = c.getContext("2d"), c.width = c.height = 1), a._nextCacheID = 1, b.getStage = function() {
            for (var a = this, b = createjs.Stage; a.parent;) a = a.parent;
            return a instanceof b ? a : null
        };
        try {
            Object.defineProperties(b, {
                stage: {
                    get: b.getStage
                }
            })
        } catch (d) {}
        b.isVisible = function() {
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY)
        }, b.draw = function(a, b) {
            var c = this.cacheCanvas;
            if (b || !c) return !1;
            var d = this._cacheScale;
            return a.drawImage(c, this._cacheOffsetX + this._filterOffsetX, this._cacheOffsetY + this._filterOffsetY, c.width / d, c.height / d), !0
        }, b.updateContext = function(b) {
            var c = this,
                d = c.mask,
                e = c._props.matrix;
            d && d.graphics && !d.graphics.isEmpty() && (d.getMatrix(e), b.transform(e.a, e.b, e.c, e.d, e.tx, e.ty), d.graphics.drawAsPath(b), b.clip(), e.invert(), b.transform(e.a, e.b, e.c, e.d, e.tx, e.ty)), this.getMatrix(e);
            var f = e.tx,
                g = e.ty;
            a._snapToPixelEnabled && c.snapToPixel && (f = f + (0 > f ? -.5 : .5) | 0, g = g + (0 > g ? -.5 : .5) | 0), b.transform(e.a, e.b, e.c, e.d, f, g), b.globalAlpha *= c.alpha, c.compositeOperation && (b.globalCompositeOperation = c.compositeOperation), c.shadow && this._applyShadow(b, c.shadow)
        }, b.cache = function(a, b, c, d, e) {
            e = e || 1, this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")), this._cacheWidth = c, this._cacheHeight = d, this._cacheOffsetX = a, this._cacheOffsetY = b, this._cacheScale = e, this.updateCache()
        }, b.updateCache = function(b) {
            var c = this.cacheCanvas;
            if (!c) throw "cache() must be called before updateCache()";
            var d = this._cacheScale,
                e = this._cacheOffsetX * d,
                f = this._cacheOffsetY * d,
                g = this._cacheWidth,
                h = this._cacheHeight,
                i = c.getContext("2d"),
                j = this._getFilterBounds();
            e += this._filterOffsetX = j.x, f += this._filterOffsetY = j.y, g = Math.ceil(g * d) + j.width, h = Math.ceil(h * d) + j.height, g != c.width || h != c.height ? (c.width = g, c.height = h) : b || i.clearRect(0, 0, g + 1, h + 1), i.save(), i.globalCompositeOperation = b, i.setTransform(d, 0, 0, d, -e, -f), this.draw(i, !0), this._applyFilters(), i.restore(), this.cacheID = a._nextCacheID++
        }, b.uncache = function() {
            this._cacheDataURL = this.cacheCanvas = null, this.cacheID = this._cacheOffsetX = this._cacheOffsetY = this._filterOffsetX = this._filterOffsetY = 0, this._cacheScale = 1
        }, b.getCacheDataURL = function() {
            return this.cacheCanvas ? (this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL()), this._cacheDataURL) : null
        }, b.localToGlobal = function(a, b, c) {
            return this.getConcatenatedMatrix(this._props.matrix).transformPoint(a, b, c || new createjs.Point)
        }, b.globalToLocal = function(a, b, c) {
            return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(a, b, c || new createjs.Point)
        }, b.localToLocal = function(a, b, c, d) {
            return d = this.localToGlobal(a, b, d), c.globalToLocal(d.x, d.y, d)
        }, b.setTransform = function(a, b, c, d, e, f, g, h, i) {
            return this.x = a || 0, this.y = b || 0, this.scaleX = null == c ? 1 : c, this.scaleY = null == d ? 1 : d, this.rotation = e || 0, this.skewX = f || 0, this.skewY = g || 0, this.regX = h || 0, this.regY = i || 0, this
        }, b.getMatrix = function(a) {
            var b = this,
                c = a && a.identity() || new createjs.Matrix2D;
            return b.transformMatrix ? c.copy(b.transformMatrix) : c.appendTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skewX, b.skewY, b.regX, b.regY)
        }, b.getConcatenatedMatrix = function(a) {
            for (var b = this, c = this.getMatrix(a); b = b.parent;) c.prependMatrix(b.getMatrix(b._props.matrix));
            return c
        }, b.getConcatenatedDisplayProps = function(a) {
            a = a ? a.identity() : new createjs.DisplayProps;
            var b = this,
                c = b.getMatrix(a.matrix);
            do a.prepend(b.visible, b.alpha, b.shadow, b.compositeOperation), b != this && c.prependMatrix(b.getMatrix(b._props.matrix)); while (b = b.parent);
            return a
        }, b.hitTest = function(b, c) {
            var d = a._hitTestContext;
            d.setTransform(1, 0, 0, 1, -b, -c), this.draw(d);
            var e = this._testHit(d);
            return d.setTransform(1, 0, 0, 1, 0, 0), d.clearRect(0, 0, 2, 2), e
        }, b.set = function(a) {
            for (var b in a) this[b] = a[b];
            return this
        }, b.getBounds = function() {
            if (this._bounds) return this._rectangle.copy(this._bounds);
            var a = this.cacheCanvas;
            if (a) {
                var b = this._cacheScale;
                return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, a.width / b, a.height / b)
            }
            return null
        }, b.getTransformedBounds = function() {
            return this._getBounds()
        }, b.setBounds = function(a, b, c, d) {
            null == a && (this._bounds = a), this._bounds = (this._bounds || new createjs.Rectangle).setValues(a, b, c, d)
        }, b.clone = function() {
            return this._cloneProps(new a)
        }, b.toString = function() {
            return "[DisplayObject (name=" + this.name + ")]"
        }, b._cloneProps = function(a) {
            return a.alpha = this.alpha, a.mouseEnabled = this.mouseEnabled, a.tickEnabled = this.tickEnabled, a.name = this.name, a.regX = this.regX, a.regY = this.regY, a.rotation = this.rotation, a.scaleX = this.scaleX, a.scaleY = this.scaleY, a.shadow = this.shadow, a.skewX = this.skewX, a.skewY = this.skewY, a.visible = this.visible, a.x = this.x, a.y = this.y, a.compositeOperation = this.compositeOperation, a.snapToPixel = this.snapToPixel, a.filters = null == this.filters ? null : this.filters.slice(0), a.mask = this.mask, a.hitArea = this.hitArea, a.cursor = this.cursor, a._bounds = this._bounds, a
        }, b._applyShadow = function(a, b) {
            b = b || Shadow.identity, a.shadowColor = b.color, a.shadowOffsetX = b.offsetX, a.shadowOffsetY = b.offsetY, a.shadowBlur = b.blur
        }, b._tick = function(a) {
            var b = this._listeners;
            b && b.tick && (a.target = null, a.propagationStopped = a.immediatePropagationStopped = !1, this.dispatchEvent(a))
        }, b._testHit = function(b) {
            try {
                var c = b.getImageData(0, 0, 1, 1).data[3] > 1
            } catch (d) {
                if (!a.suppressCrossDomainErrors) throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
            }
            return c
        }, b._applyFilters = function() {
            if (this.filters && 0 != this.filters.length && this.cacheCanvas)
                for (var a = this.filters.length, b = this.cacheCanvas.getContext("2d"), c = this.cacheCanvas.width, d = this.cacheCanvas.height, e = 0; a > e; e++) this.filters[e].applyFilter(b, 0, 0, c, d)
        }, b._getFilterBounds = function() {
            var a, b = this.filters,
                c = this._rectangle.setValues(0, 0, 0, 0);
            if (!b || !(a = b.length)) return c;
            for (var d = 0; a > d; d++) {
                var e = this.filters[d];
                e.getBounds && e.getBounds(c)
            }
            return c
        }, b._getBounds = function(a, b) {
            return this._transformBounds(this.getBounds(), a, b)
        }, b._transformBounds = function(a, b, c) {
            if (!a) return a;
            var d = a.x,
                e = a.y,
                f = a.width,
                g = a.height,
                h = this._props.matrix;
            h = c ? h.identity() : this.getMatrix(h), (d || e) && h.appendTransform(0, 0, 1, 1, 0, 0, 0, -d, -e), b && h.prependMatrix(b);
            var i = f * h.a,
                j = f * h.b,
                k = g * h.c,
                l = g * h.d,
                m = h.tx,
                n = h.ty,
                o = m,
                p = m,
                q = n,
                r = n;
            return (d = i + m) < o ? o = d : d > p && (p = d), (d = i + k + m) < o ? o = d : d > p && (p = d), (d = k + m) < o ? o = d : d > p && (p = d), (e = j + n) < q ? q = e : e > r && (r = e), (e = j + l + n) < q ? q = e : e > r && (r = e), (e = l + n) < q ? q = e : e > r && (r = e), a.setValues(o, q, p - o, r - q)
        }, b._hasMouseEventListener = function() {
            for (var b = a._MOUSE_EVENTS, c = 0, d = b.length; d > c; c++)
                if (this.hasEventListener(b[c])) return !0;
            return !!this.cursor
        }, createjs.DisplayObject = createjs.promote(a, "EventDispatcher")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            this.DisplayObject_constructor(), this.children = [], this.mouseChildren = !0, this.tickChildren = !0
        }
        var b = createjs.extend(a, createjs.DisplayObject);
        b.getNumChildren = function() {
            return this.children.length
        };
        try {
            Object.defineProperties(b, {
                numChildren: {
                    get: b.getNumChildren
                }
            })
        } catch (c) {}
        b.initialize = a, b.isVisible = function() {
            var a = this.cacheCanvas || this.children.length;
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
        }, b.draw = function(a, b) {
            if (this.DisplayObject_draw(a, b)) return !0;
            for (var c = this.children.slice(), d = 0, e = c.length; e > d; d++) {
                var f = c[d];
                f.isVisible() && (a.save(), f.updateContext(a), f.draw(a), a.restore())
            }
            return !0
        }, b.addChild = function(a) {
            if (null == a) return a;
            var b = arguments.length;
            if (b > 1) {
                for (var c = 0; b > c; c++) this.addChild(arguments[c]);
                return arguments[b - 1]
            }
            return a.parent && a.parent.removeChild(a), a.parent = this, this.children.push(a), a.dispatchEvent("added"), a
        }, b.addChildAt = function(a, b) {
            var c = arguments.length,
                d = arguments[c - 1];
            if (0 > d || d > this.children.length) return arguments[c - 2];
            if (c > 2) {
                for (var e = 0; c - 1 > e; e++) this.addChildAt(arguments[e], d + e);
                return arguments[c - 2]
            }
            return a.parent && a.parent.removeChild(a), a.parent = this, this.children.splice(b, 0, a), a.dispatchEvent("added"), a
        }, b.removeChild = function(a) {
            var b = arguments.length;
            if (b > 1) {
                for (var c = !0, d = 0; b > d; d++) c = c && this.removeChild(arguments[d]);
                return c
            }
            return this.removeChildAt(createjs.indexOf(this.children, a))
        }, b.removeChildAt = function(a) {
            var b = arguments.length;
            if (b > 1) {
                for (var c = [], d = 0; b > d; d++) c[d] = arguments[d];
                c.sort(function(a, b) {
                    return b - a
                });
                for (var e = !0, d = 0; b > d; d++) e = e && this.removeChildAt(c[d]);
                return e
            }
            if (0 > a || a > this.children.length - 1) return !1;
            var f = this.children[a];
            return f && (f.parent = null), this.children.splice(a, 1), f.dispatchEvent("removed"), !0
        }, b.removeAllChildren = function() {
            for (var a = this.children; a.length;) this.removeChildAt(0)
        }, b.getChildAt = function(a) {
            return this.children[a]
        }, b.getChildByName = function(a) {
            for (var b = this.children, c = 0, d = b.length; d > c; c++)
                if (b[c].name == a) return b[c];
            return null
        }, b.sortChildren = function(a) {
            this.children.sort(a)
        }, b.getChildIndex = function(a) {
            return createjs.indexOf(this.children, a)
        }, b.swapChildrenAt = function(a, b) {
            var c = this.children,
                d = c[a],
                e = c[b];
            d && e && (c[a] = e, c[b] = d)
        }, b.swapChildren = function(a, b) {
            for (var c, d, e = this.children, f = 0, g = e.length; g > f && (e[f] == a && (c = f), e[f] == b && (d = f), null == c || null == d); f++);
            f != g && (e[c] = b, e[d] = a)
        }, b.setChildIndex = function(a, b) {
            var c = this.children,
                d = c.length;
            if (!(a.parent != this || 0 > b || b >= d)) {
                for (var e = 0; d > e && c[e] != a; e++);
                e != d && e != b && (c.splice(e, 1), c.splice(b, 0, a))
            }
        }, b.contains = function(a) {
            for (; a;) {
                if (a == this) return !0;
                a = a.parent
            }
            return !1
        }, b.hitTest = function(a, b) {
            return null != this.getObjectUnderPoint(a, b)
        }, b.getObjectsUnderPoint = function(a, b, c) {
            var d = [],
                e = this.localToGlobal(a, b);
            return this._getObjectsUnderPoint(e.x, e.y, d, c > 0, 1 == c), d
        }, b.getObjectUnderPoint = function(a, b, c) {
            var d = this.localToGlobal(a, b);
            return this._getObjectsUnderPoint(d.x, d.y, null, c > 0, 1 == c)
        }, b.getBounds = function() {
            return this._getBounds(null, !0)
        }, b.getTransformedBounds = function() {
            return this._getBounds()
        }, b.clone = function(b) {
            var c = this._cloneProps(new a);
            return b && this._cloneChildren(c), c
        }, b.toString = function() {
            return "[Container (name=" + this.name + ")]"
        }, b._tick = function(a) {
            if (this.tickChildren)
                for (var b = this.children.length - 1; b >= 0; b--) {
                    var c = this.children[b];
                    c.tickEnabled && c._tick && c._tick(a)
                }
            this.DisplayObject__tick(a)
        }, b._cloneChildren = function(a) {
            a.children.length && a.removeAllChildren();
            for (var b = a.children, c = 0, d = this.children.length; d > c; c++) {
                var e = this.children[c].clone(!0);
                e.parent = a, b.push(e)
            }
        }, b._getObjectsUnderPoint = function(b, c, d, e, f, g) {
            if (g = g || 0, !g && !this._testMask(this, b, c)) return null;
            var h, i = createjs.DisplayObject._hitTestContext;
            f = f || e && this._hasMouseEventListener();
            for (var j = this.children, k = j.length, l = k - 1; l >= 0; l--) {
                var m = j[l],
                    n = m.hitArea;
                if (m.visible && (n || m.isVisible()) && (!e || m.mouseEnabled) && (n || this._testMask(m, b, c)))
                    if (!n && m instanceof a) {
                        var o = m._getObjectsUnderPoint(b, c, d, e, f, g + 1);
                        if (!d && o) return e && !this.mouseChildren ? this : o
                    } else {
                        if (e && !f && !m._hasMouseEventListener()) continue;
                        var p = m.getConcatenatedDisplayProps(m._props);
                        if (h = p.matrix, n && (h.appendMatrix(n.getMatrix(n._props.matrix)), p.alpha = n.alpha), i.globalAlpha = p.alpha, i.setTransform(h.a, h.b, h.c, h.d, h.tx - b, h.ty - c), (n || m).draw(i), !this._testHit(i)) continue;
                        if (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(0, 0, 2, 2), !d) return e && !this.mouseChildren ? this : m;
                        d.push(m)
                    }
            }
            return null
        }, b._testMask = function(a, b, c) {
            var d = a.mask;
            if (!d || !d.graphics || d.graphics.isEmpty()) return !0;
            var e = this._props.matrix,
                f = a.parent;
            e = f ? f.getConcatenatedMatrix(e) : e.identity(), e = d.getMatrix(d._props.matrix).prependMatrix(e);
            var g = createjs.DisplayObject._hitTestContext;
            return g.setTransform(e.a, e.b, e.c, e.d, e.tx - b, e.ty - c), d.graphics.drawAsPath(g), g.fillStyle = "#000", g.fill(), this._testHit(g) ? (g.setTransform(1, 0, 0, 1, 0, 0), g.clearRect(0, 0, 2, 2), !0) : !1
        }, b._getBounds = function(a, b) {
            var c = this.DisplayObject_getBounds();
            if (c) return this._transformBounds(c, a, b);
            var d = this._props.matrix;
            d = b ? d.identity() : this.getMatrix(d), a && d.prependMatrix(a);
            for (var e = this.children.length, f = null, g = 0; e > g; g++) {
                var h = this.children[g];
                h.visible && (c = h._getBounds(d)) && (f ? f.extend(c.x, c.y, c.width, c.height) : f = c.clone())
            }
            return f
        }, createjs.Container = createjs.promote(a, "DisplayObject")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.Container_constructor(), this.autoClear = !0, this.canvas = "string" == typeof a ? document.getElementById(a) : a, this.mouseX = 0, this.mouseY = 0, this.drawRect = null, this.snapToPixelEnabled = !1, this.mouseInBounds = !1, this.tickOnUpdate = !0, this.mouseMoveOutside = !1, this.preventSelection = !0, this._pointerData = {}, this._pointerCount = 0, this._primaryPointerID = null, this._mouseOverIntervalID = null, this._nextStage = null, this._prevStage = null, this.enableDOMEvents(!0)
        }
        var b = createjs.extend(a, createjs.Container);
        b._get_nextStage = function() {
            return this._nextStage
        }, b._set_nextStage = function(a) {
            this._nextStage && (this._nextStage._prevStage = null), a && (a._prevStage = this), this._nextStage = a
        };
        try {
            Object.defineProperties(b, {
                nextStage: {
                    get: b._get_nextStage,
                    set: b._set_nextStage
                }
            })
        } catch (c) {}
        b.update = function(a) {
            if (this.canvas && (this.tickOnUpdate && this.tick(a), this.dispatchEvent("drawstart", !1, !0) !== !1)) {
                createjs.DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
                var b = this.drawRect,
                    c = this.canvas.getContext("2d");
                c.setTransform(1, 0, 0, 1, 0, 0), this.autoClear && (b ? c.clearRect(b.x, b.y, b.width, b.height) : c.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)), c.save(), this.drawRect && (c.beginPath(), c.rect(b.x, b.y, b.width, b.height), c.clip()), this.updateContext(c), this.draw(c, !1), c.restore(), this.dispatchEvent("drawend")
            }
        }, b.tick = function(a) {
            if (this.tickEnabled && this.dispatchEvent("tickstart", !1, !0) !== !1) {
                var b = new createjs.Event("tick");
                if (a)
                    for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
                this._tick(b), this.dispatchEvent("tickend")
            }
        }, b.handleEvent = function(a) {
            "tick" == a.type && this.update(a)
        }, b.clear = function() {
            if (this.canvas) {
                var a = this.canvas.getContext("2d");
                a.setTransform(1, 0, 0, 1, 0, 0), a.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
            }
        }, b.toDataURL = function(a, b) {
            var c, d = this.canvas.getContext("2d"),
                e = this.canvas.width,
                f = this.canvas.height;
            if (a) {
                c = d.getImageData(0, 0, e, f);
                var g = d.globalCompositeOperation;
                d.globalCompositeOperation = "destination-over", d.fillStyle = a, d.fillRect(0, 0, e, f)
            }
            var h = this.canvas.toDataURL(b || "image/png");
            return a && (d.putImageData(c, 0, 0), d.globalCompositeOperation = g), h
        }, b.enableMouseOver = function(a) {
            if (this._mouseOverIntervalID && (clearInterval(this._mouseOverIntervalID), this._mouseOverIntervalID = null, 0 == a && this._testMouseOver(!0)), null == a) a = 20;
            else if (0 >= a) return;
            var b = this;
            this._mouseOverIntervalID = setInterval(function() {
                b._testMouseOver()
            }, 1e3 / Math.min(50, a))
        }, b.enableDOMEvents = function(a) {
            null == a && (a = !0);
            var b, c, d = this._eventListeners;
            if (!a && d) {
                for (b in d) c = d[b], c.t.removeEventListener(b, c.f, !1);
                this._eventListeners = null
            } else if (a && !d && this.canvas) {
                var e = window.addEventListener ? window : document,
                    f = this;
                d = this._eventListeners = {}, d.mouseup = {
                    t: e,
                    f: function(a) {
                        f._handleMouseUp(a)
                    }
                }, d.mousemove = {
                    t: e,
                    f: function(a) {
                        f._handleMouseMove(a)
                    }
                }, d.dblclick = {
                    t: this.canvas,
                    f: function(a) {
                        f._handleDoubleClick(a)
                    }
                }, d.mousedown = {
                    t: this.canvas,
                    f: function(a) {
                        f._handleMouseDown(a)
                    }
                };
                for (b in d) c = d[b], c.t.addEventListener(b, c.f, !1)
            }
        }, b.clone = function() {
            throw "Stage cannot be cloned."
        }, b.toString = function() {
            return "[Stage (name=" + this.name + ")]"
        }, b._getElementRect = function(a) {
            var b;
            try {
                b = a.getBoundingClientRect()
            } catch (c) {
                b = {
                    top: a.offsetTop,
                    left: a.offsetLeft,
                    width: a.offsetWidth,
                    height: a.offsetHeight
                }
            }
            var d = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0),
                e = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0),
                f = window.getComputedStyle ? getComputedStyle(a, null) : a.currentStyle,
                g = parseInt(f.paddingLeft) + parseInt(f.borderLeftWidth),
                h = parseInt(f.paddingTop) + parseInt(f.borderTopWidth),
                i = parseInt(f.paddingRight) + parseInt(f.borderRightWidth),
                j = parseInt(f.paddingBottom) + parseInt(f.borderBottomWidth);
            return {
                left: b.left + d + g,
                right: b.right + d - i,
                top: b.top + e + h,
                bottom: b.bottom + e - j
            }
        }, b._getPointerData = function(a) {
            var b = this._pointerData[a];
            return b || (b = this._pointerData[a] = {
                x: 0,
                y: 0
            }), b
        }, b._handleMouseMove = function(a) {
            a || (a = window.event), this._handlePointerMove(-1, a, a.pageX, a.pageY)
        }, b._handlePointerMove = function(a, b, c, d, e) {
            if ((!this._prevStage || void 0 !== e) && this.canvas) {
                var f = this._nextStage,
                    g = this._getPointerData(a),
                    h = g.inBounds;
                this._updatePointerPosition(a, b, c, d), (h || g.inBounds || this.mouseMoveOutside) && (-1 === a && g.inBounds == !h && this._dispatchMouseEvent(this, h ? "mouseleave" : "mouseenter", !1, a, g, b), this._dispatchMouseEvent(this, "stagemousemove", !1, a, g, b), this._dispatchMouseEvent(g.target, "pressmove", !0, a, g, b)), f && f._handlePointerMove(a, b, c, d, null)
            }
        }, b._updatePointerPosition = function(a, b, c, d) {
            var e = this._getElementRect(this.canvas);
            c -= e.left, d -= e.top;
            var f = this.canvas.width,
                g = this.canvas.height;
            c /= (e.right - e.left) / f, d /= (e.bottom - e.top) / g;
            var h = this._getPointerData(a);
            (h.inBounds = c >= 0 && d >= 0 && f - 1 >= c && g - 1 >= d) ? (h.x = c, h.y = d) : this.mouseMoveOutside && (h.x = 0 > c ? 0 : c > f - 1 ? f - 1 : c, h.y = 0 > d ? 0 : d > g - 1 ? g - 1 : d), h.posEvtObj = b, h.rawX = c, h.rawY = d, (a === this._primaryPointerID || -1 === a) && (this.mouseX = h.x, this.mouseY = h.y, this.mouseInBounds = h.inBounds)
        }, b._handleMouseUp = function(a) {
            this._handlePointerUp(-1, a, !1)
        }, b._handlePointerUp = function(a, b, c, d) {
            var e = this._nextStage,
                f = this._getPointerData(a);
            if (!this._prevStage || void 0 !== d) {
                var g = null,
                    h = f.target;
                d || !h && !e || (g = this._getObjectsUnderPoint(f.x, f.y, null, !0)), f.down && (this._dispatchMouseEvent(this, "stagemouseup", !1, a, f, b, g), f.down = !1), g == h && this._dispatchMouseEvent(h, "click", !0, a, f, b), this._dispatchMouseEvent(h, "pressup", !0, a, f, b), c ? (a == this._primaryPointerID && (this._primaryPointerID = null), delete this._pointerData[a]) : f.target = null, e && e._handlePointerUp(a, b, c, d || g && this)
            }
        }, b._handleMouseDown = function(a) {
            this._handlePointerDown(-1, a, a.pageX, a.pageY)
        }, b._handlePointerDown = function(a, b, c, d, e) {
            this.preventSelection && b.preventDefault(), (null == this._primaryPointerID || -1 === a) && (this._primaryPointerID = a), null != d && this._updatePointerPosition(a, b, c, d);
            var f = null,
                g = this._nextStage,
                h = this._getPointerData(a);
            e || (f = h.target = this._getObjectsUnderPoint(h.x, h.y, null, !0)), h.inBounds && (this._dispatchMouseEvent(this, "stagemousedown", !1, a, h, b, f), h.down = !0), this._dispatchMouseEvent(f, "mousedown", !0, a, h, b), g && g._handlePointerDown(a, b, c, d, e || f && this)
        }, b._testMouseOver = function(a, b, c) {
            if (!this._prevStage || void 0 !== b) {
                var d = this._nextStage;
                if (!this._mouseOverIntervalID) return void(d && d._testMouseOver(a, b, c));
                var e = this._getPointerData(-1);
                if (e && (a || this.mouseX != this._mouseOverX || this.mouseY != this._mouseOverY || !this.mouseInBounds)) {
                    var f, g, h, i = e.posEvtObj,
                        j = c || i && i.target == this.canvas,
                        k = null,
                        l = -1,
                        m = "";
                    !b && (a || this.mouseInBounds && j) && (k = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, !0), this._mouseOverX = this.mouseX, this._mouseOverY = this.mouseY);
                    var n = this._mouseOverTarget || [],
                        o = n[n.length - 1],
                        p = this._mouseOverTarget = [];
                    for (f = k; f;) p.unshift(f), m || (m = f.cursor), f = f.parent;
                    for (this.canvas.style.cursor = m, !b && c && (c.canvas.style.cursor = m), g = 0, h = p.length; h > g && p[g] == n[g]; g++) l = g;
                    for (o != k && this._dispatchMouseEvent(o, "mouseout", !0, -1, e, i, k), g = n.length - 1; g > l; g--) this._dispatchMouseEvent(n[g], "rollout", !1, -1, e, i, k);
                    for (g = p.length - 1; g > l; g--) this._dispatchMouseEvent(p[g], "rollover", !1, -1, e, i, o);
                    o != k && this._dispatchMouseEvent(k, "mouseover", !0, -1, e, i, o), d && d._testMouseOver(a, b || k && this, c || j && this)
                }
            }
        }, b._handleDoubleClick = function(a, b) {
            var c = null,
                d = this._nextStage,
                e = this._getPointerData(-1);
            b || (c = this._getObjectsUnderPoint(e.x, e.y, null, !0), this._dispatchMouseEvent(c, "dblclick", !0, -1, e, a)), d && d._handleDoubleClick(a, b || c && this)
        }, b._dispatchMouseEvent = function(a, b, c, d, e, f, g) {
            if (a && (c || a.hasEventListener(b))) {
                var h = new createjs.MouseEvent(b, c, !1, e.x, e.y, f, d, d === this._primaryPointerID || -1 === d, e.rawX, e.rawY, g);
                a.dispatchEvent(h)
            }
        }, createjs.Stage = createjs.promote(a, "Container")
    }(), this.createjs = this.createjs || {},
    function() {
        function a(a) {
            this.DisplayObject_constructor(), "string" == typeof a ? (this.image = document.createElement("img"), this.image.src = a) : this.image = a, this.sourceRect = null
        }
        var b = createjs.extend(a, createjs.DisplayObject);
        b.initialize = a, b.isVisible = function() {
            var a = this.image,
                b = this.cacheCanvas || a && (a.naturalWidth || a.getContext || a.readyState >= 2);
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && b)
        }, b.draw = function(a, b) {
            if (this.DisplayObject_draw(a, b) || !this.image) return !0;
            var c = this.image,
                d = this.sourceRect;
            if (d) {
                var e = d.x,
                    f = d.y,
                    g = e + d.width,
                    h = f + d.height,
                    i = 0,
                    j = 0,
                    k = c.width,
                    l = c.height;
                0 > e && (i -= e, e = 0), g > k && (g = k), 0 > f && (j -= f, f = 0), h > l && (h = l), a.drawImage(c, e, f, g - e, h - f, i, j, g - e, h - f)
            } else a.drawImage(c, 0, 0);
            return !0
        }, b.getBounds = function() {
            var a = this.DisplayObject_getBounds();
            if (a) return a;
            var b = this.image,
                c = this.sourceRect || b,
                d = b && (b.naturalWidth || b.getContext || b.readyState >= 2);
            return d ? this._rectangle.setValues(0, 0, c.width, c.height) : null
        }, b.clone = function() {
            var b = new a(this.image);
            return this.sourceRect && (b.sourceRect = this.sourceRect.clone()), this._cloneProps(b), b
        }, b.toString = function() {
            return "[Bitmap (name=" + this.name + ")]"
        }, createjs.Bitmap = createjs.promote(a, "DisplayObject")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.DisplayObject_constructor(), this.currentFrame = 0, this.currentAnimation = null, this.paused = !0, this.spriteSheet = a, this.currentAnimationFrame = 0, this.framerate = 0, this._animation = null, this._currentFrame = null, this._skipAdvance = !1, null != b && this.gotoAndPlay(b)
        }
        var b = createjs.extend(a, createjs.DisplayObject);
        b.initialize = a, b.isVisible = function() {
            var a = this.cacheCanvas || this.spriteSheet.complete;
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
        }, b.draw = function(a, b) {
            if (this.DisplayObject_draw(a, b)) return !0;
            this._normalizeFrame();
            var c = this.spriteSheet.getFrame(0 | this._currentFrame);
            if (!c) return !1;
            var d = c.rect;
            return d.width && d.height && a.drawImage(c.image, d.x, d.y, d.width, d.height, -c.regX, -c.regY, d.width, d.height), !0
        }, b.play = function() {
            this.paused = !1
        }, b.stop = function() {
            this.paused = !0
        }, b.gotoAndPlay = function(a) {
            this.paused = !1, this._skipAdvance = !0, this._goto(a)
        }, b.gotoAndStop = function(a) {
            this.paused = !0, this._goto(a)
        }, b.advance = function(a) {
            var b = this.framerate || this.spriteSheet.framerate,
                c = b && null != a ? a / (1e3 / b) : 1;
            this._normalizeFrame(c)
        }, b.getBounds = function() {
            return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle)
        }, b.clone = function() {
            return this._cloneProps(new a(this.spriteSheet))
        }, b.toString = function() {
            return "[Sprite (name=" + this.name + ")]"
        }, b._cloneProps = function(a) {
            return this.DisplayObject__cloneProps(a), a.currentFrame = this.currentFrame, a.currentAnimation = this.currentAnimation, a.paused = this.paused, a.currentAnimationFrame = this.currentAnimationFrame, a.framerate = this.framerate, a._animation = this._animation, a._currentFrame = this._currentFrame, a._skipAdvance = this._skipAdvance, a
        }, b._tick = function(a) {
            this.paused || (this._skipAdvance || this.advance(a && a.delta), this._skipAdvance = !1), this.DisplayObject__tick(a)
        }, b._normalizeFrame = function(a) {
            a = a || 0;
            var b, c = this._animation,
                d = this.paused,
                e = this._currentFrame;
            if (c) {
                var f = c.speed || 1,
                    g = this.currentAnimationFrame;
                if (b = c.frames.length, g + a * f >= b) {
                    var h = c.next;
                    if (this._dispatchAnimationEnd(c, e, d, h, b - 1)) return;
                    if (h) return this._goto(h, a - (b - g) / f);
                    this.paused = !0, g = c.frames.length - 1
                } else g += a * f;
                this.currentAnimationFrame = g, this._currentFrame = c.frames[0 | g]
            } else if (e = this._currentFrame += a, b = this.spriteSheet.getNumFrames(), e >= b && b > 0 && !this._dispatchAnimationEnd(c, e, d, b - 1) && (this._currentFrame -= b) >= b) return this._normalizeFrame();
            e = 0 | this._currentFrame, this.currentFrame != e && (this.currentFrame = e, this.dispatchEvent("change"))
        }, b._dispatchAnimationEnd = function(a, b, c, d, e) {
            var f = a ? a.name : null;
            if (this.hasEventListener("animationend")) {
                var g = new createjs.Event("animationend");
                g.name = f, g.next = d, this.dispatchEvent(g)
            }
            var h = this._animation != a || this._currentFrame != b;
            return h || c || !this.paused || (this.currentAnimationFrame = e, h = !0), h
        }, b._goto = function(a, b) {
            if (this.currentAnimationFrame = 0, isNaN(a)) {
                var c = this.spriteSheet.getAnimation(a);
                c && (this._animation = c, this.currentAnimation = a, this._normalizeFrame(b))
            } else this.currentAnimation = this._animation = null, this._currentFrame = a, this._normalizeFrame()
        }, createjs.Sprite = createjs.promote(a, "DisplayObject")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.DisplayObject_constructor(), this.graphics = a ? a : new createjs.Graphics
        }
        var b = createjs.extend(a, createjs.DisplayObject);
        b.isVisible = function() {
            var a = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
        }, b.draw = function(a, b) {
            return this.DisplayObject_draw(a, b) ? !0 : (this.graphics.draw(a, this), !0)
        }, b.clone = function(b) {
            var c = b && this.graphics ? this.graphics.clone() : this.graphics;
            return this._cloneProps(new a(c))
        }, b.toString = function() {
            return "[Shape (name=" + this.name + ")]"
        }, createjs.Shape = createjs.promote(a, "DisplayObject")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.DisplayObject_constructor(), this.text = a, this.font = b, this.color = c, this.textAlign = "left", this.textBaseline = "top", this.maxWidth = null, this.outline = 0, this.lineHeight = 0, this.lineWidth = null
        }
        var b = createjs.extend(a, createjs.DisplayObject),
            c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        c.getContext && (a._workingContext = c.getContext("2d"), c.width = c.height = 1), a.H_OFFSETS = {
            start: 0,
            left: 0,
            center: -.5,
            end: -1,
            right: -1
        }, a.V_OFFSETS = {
            top: 0,
            hanging: -.01,
            middle: -.4,
            alphabetic: -.8,
            ideographic: -.85,
            bottom: -1
        }, b.isVisible = function() {
            var a = this.cacheCanvas || null != this.text && "" !== this.text;
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY && a)
        }, b.draw = function(a, b) {
            if (this.DisplayObject_draw(a, b)) return !0;
            var c = this.color || "#000";
            return this.outline ? (a.strokeStyle = c, a.lineWidth = 1 * this.outline) : a.fillStyle = c, this._drawText(this._prepContext(a)), !0
        }, b.getMeasuredWidth = function() {
            return this._getMeasuredWidth(this.text)
        }, b.getMeasuredLineHeight = function() {
            return 1.2 * this._getMeasuredWidth("M")
        }, b.getMeasuredHeight = function() {
            return this._drawText(null, {}).height
        }, b.getBounds = function() {
            var b = this.DisplayObject_getBounds();
            if (b) return b;
            if (null == this.text || "" === this.text) return null;
            var c = this._drawText(null, {}),
                d = this.maxWidth && this.maxWidth < c.width ? this.maxWidth : c.width,
                e = d * a.H_OFFSETS[this.textAlign || "left"],
                f = this.lineHeight || this.getMeasuredLineHeight(),
                g = f * a.V_OFFSETS[this.textBaseline || "top"];
            return this._rectangle.setValues(e, g, d, c.height)
        }, b.getMetrics = function() {
            var b = {
                lines: []
            };
            return b.lineHeight = this.lineHeight || this.getMeasuredLineHeight(), b.vOffset = b.lineHeight * a.V_OFFSETS[this.textBaseline || "top"], this._drawText(null, b, b.lines)
        }, b.clone = function() {
            return this._cloneProps(new a(this.text, this.font, this.color))
        }, b.toString = function() {
            return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
        }, b._cloneProps = function(a) {
            return this.DisplayObject__cloneProps(a), a.textAlign = this.textAlign, a.textBaseline = this.textBaseline, a.maxWidth = this.maxWidth, a.outline = this.outline, a.lineHeight = this.lineHeight, a.lineWidth = this.lineWidth, a
        }, b._prepContext = function(a) {
            return a.font = this.font || "10px sans-serif", a.textAlign = this.textAlign || "left", a.textBaseline = this.textBaseline || "top", a
        }, b._drawText = function(b, c, d) {
            var e = !!b;
            e || (b = a._workingContext, b.save(), this._prepContext(b));
            for (var f = this.lineHeight || this.getMeasuredLineHeight(), g = 0, h = 0, i = String(this.text).split(/(?:\r\n|\r|\n)/), j = 0, k = i.length; k > j; j++) {
                var l = i[j],
                    m = null;
                if (null != this.lineWidth && (m = b.measureText(l).width) > this.lineWidth) {
                    var n = l.split(/(\s)/);
                    l = n[0], m = b.measureText(l).width;
                    for (var o = 1, p = n.length; p > o; o += 2) {
                        var q = b.measureText(n[o] + n[o + 1]).width;
                        m + q > this.lineWidth ? (e && this._drawTextLine(b, l, h * f), d && d.push(l), m > g && (g = m), l = n[o + 1], m = b.measureText(l).width, h++) : (l += n[o] + n[o + 1], m += q)
                    }
                }
                e && this._drawTextLine(b, l, h * f), d && d.push(l), c && null == m && (m = b.measureText(l).width), m > g && (g = m), h++
            }
            return c && (c.width = g, c.height = h * f), e || b.restore(), c
        }, b._drawTextLine = function(a, b, c) {
            this.outline ? a.strokeText(b, 0, c, this.maxWidth || 65535) : a.fillText(b, 0, c, this.maxWidth || 65535)
        }, b._getMeasuredWidth = function(b) {
            var c = a._workingContext;
            c.save();
            var d = this._prepContext(c).measureText(b).width;
            return c.restore(), d
        }, createjs.Text = createjs.promote(a, "DisplayObject")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.Container_constructor(), this.text = a || "", this.spriteSheet = b, this.lineHeight = 0, this.letterSpacing = 0, this.spaceWidth = 0, this._oldProps = {
                text: 0,
                spriteSheet: 0,
                lineHeight: 0,
                letterSpacing: 0,
                spaceWidth: 0
            }
        }
        var b = createjs.extend(a, createjs.Container);
        a.maxPoolSize = 100, a._spritePool = [], b.draw = function(a, b) {
            this.DisplayObject_draw(a, b) || (this._updateText(), this.Container_draw(a, b))
        }, b.getBounds = function() {
            return this._updateText(), this.Container_getBounds()
        }, b.isVisible = function() {
            var a = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
            return !!(this.visible && this.alpha > 0 && 0 !== this.scaleX && 0 !== this.scaleY && a)
        }, b.clone = function() {
            return this._cloneProps(new a(this.text, this.spriteSheet))
        }, b.addChild = b.addChildAt = b.removeChild = b.removeChildAt = b.removeAllChildren = function() {}, b._cloneProps = function(a) {
            return this.Container__cloneProps(a), a.lineHeight = this.lineHeight, a.letterSpacing = this.letterSpacing, a.spaceWidth = this.spaceWidth, a
        }, b._getFrameIndex = function(a, b) {
            var c, d = b.getAnimation(a);
            return d || (a != (c = a.toUpperCase()) || a != (c = a.toLowerCase()) || (c = null), c && (d = b.getAnimation(c))), d && d.frames[0]
        }, b._getFrame = function(a, b) {
            var c = this._getFrameIndex(a, b);
            return null == c ? c : b.getFrame(c)
        }, b._getLineHeight = function(a) {
            var b = this._getFrame("1", a) || this._getFrame("T", a) || this._getFrame("L", a) || a.getFrame(0);
            return b ? b.rect.height : 1
        }, b._getSpaceWidth = function(a) {
            var b = this._getFrame("1", a) || this._getFrame("l", a) || this._getFrame("e", a) || this._getFrame("a", a) || a.getFrame(0);
            return b ? b.rect.width : 1
        }, b._updateText = function() {
            var b, c = 0,
                d = 0,
                e = this._oldProps,
                f = !1,
                g = this.spaceWidth,
                h = this.lineHeight,
                i = this.spriteSheet,
                j = a._spritePool,
                k = this.children,
                l = 0,
                m = k.length;
            for (var n in e) e[n] != this[n] && (e[n] = this[n], f = !0);
            if (f) {
                var o = !!this._getFrame(" ", i);
                o || g || (g = this._getSpaceWidth(i)), h || (h = this._getLineHeight(i));
                for (var p = 0, q = this.text.length; q > p; p++) {
                    var r = this.text.charAt(p);
                    if (" " != r || o)
                        if ("\n" != r && "\r" != r) {
                            var s = this._getFrameIndex(r, i);
                            null != s && (m > l ? b = k[l] : (k.push(b = j.length ? j.pop() : new createjs.Sprite), b.parent = this, m++), b.spriteSheet = i, b.gotoAndStop(s), b.x = c, b.y = d, l++, c += b.getBounds().width + this.letterSpacing)
                        } else "\r" == r && "\n" == this.text.charAt(p + 1) && p++, c = 0, d += h;
                    else c += g
                }
                for (; m > l;) j.push(b = k.pop()), b.parent = null, m--;
                j.length > a.maxPoolSize && (j.length = a.maxPoolSize)
            }
        }, createjs.BitmapText = createjs.promote(a, "Container")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(b, c, d, e) {
            this.Container_constructor(), !a.inited && a.init(), this.mode = b || a.INDEPENDENT, this.startPosition = c || 0, this.loop = d, this.currentFrame = 0, this.timeline = new createjs.Timeline(null, e, {
                paused: !0,
                position: c,
                useTicks: !0
            }), this.paused = !1, this.actionsEnabled = !0, this.autoReset = !0, this.frameBounds = this.frameBounds || null, this.framerate = null, this._synchOffset = 0, this._prevPos = -1, this._prevPosition = 0, this._t = 0, this._managed = {}
        }

        function b() {
            throw "MovieClipPlugin cannot be instantiated."
        }
        var c = createjs.extend(a, createjs.Container);
        a.INDEPENDENT = "independent", a.SINGLE_FRAME = "single", a.SYNCHED = "synched", a.inited = !1, a.init = function() {
            a.inited || (b.install(), a.inited = !0)
        }, c.getLabels = function() {
            return this.timeline.getLabels()
        }, c.getCurrentLabel = function() {
            return this._updateTimeline(), this.timeline.getCurrentLabel()
        }, c.getDuration = function() {
            return this.timeline.duration
        };
        try {
            Object.defineProperties(c, {
                labels: {
                    get: c.getLabels
                },
                currentLabel: {
                    get: c.getCurrentLabel
                },
                totalFrames: {
                    get: c.getDuration
                },
                duration: {
                    get: c.getDuration
                }
            })
        } catch (d) {}
        c.initialize = a, c.isVisible = function() {
            return !!(this.visible && this.alpha > 0 && 0 != this.scaleX && 0 != this.scaleY)
        }, c.draw = function(a, b) {
            return this.DisplayObject_draw(a, b) ? !0 : (this._updateTimeline(), this.Container_draw(a, b), !0)
        }, c.play = function() {
            this.paused = !1
        }, c.stop = function() {
            this.paused = !0
        }, c.gotoAndPlay = function(a) {
            this.paused = !1, this._goto(a)
        }, c.gotoAndStop = function(a) {
            this.paused = !0, this._goto(a)
        }, c.advance = function(b) {
            var c = a.INDEPENDENT;
            if (this.mode == c) {
                for (var d = this, e = d.framerate;
                    (d = d.parent) && null == e;) d.mode == c && (e = d._framerate);
                this._framerate = e;
                var f = null != e && -1 != e && null != b ? b / (1e3 / e) + this._t : 1,
                    g = 0 | f;
                for (this._t = f - g; !this.paused && g--;) this._prevPosition = this._prevPos < 0 ? 0 : this._prevPosition + 1, this._updateTimeline()
            }
        }, c.clone = function() {
            throw "MovieClip cannot be cloned."
        }, c.toString = function() {
            return "[MovieClip (name=" + this.name + ")]"
        }, c._tick = function(a) {
            this.advance(a && a.delta), this.Container__tick(a)
        }, c._goto = function(a) {
            var b = this.timeline.resolve(a);
            null != b && (-1 == this._prevPos && (this._prevPos = 0 / 0), this._prevPosition = b, this._t = 0, this._updateTimeline())
        }, c._reset = function() {
            this._prevPos = -1, this._t = this.currentFrame = 0, this.paused = !1
        }, c._updateTimeline = function() {
            var b = this.timeline,
                c = this.mode != a.INDEPENDENT;
            b.loop = null == this.loop ? !0 : this.loop;
            var d = c ? this.startPosition + (this.mode == a.SINGLE_FRAME ? 0 : this._synchOffset) : this._prevPos < 0 ? 0 : this._prevPosition,
                e = c || !this.actionsEnabled ? createjs.Tween.NONE : null;
            if (this.currentFrame = b._calcPosition(d), b.setPosition(d, e), this._prevPosition = b._prevPosition, this._prevPos != b._prevPos) {
                this.currentFrame = this._prevPos = b._prevPos;
                for (var f in this._managed) this._managed[f] = 1;
                for (var g = b._tweens, h = 0, i = g.length; i > h; h++) {
                    var j = g[h],
                        k = j._target;
                    if (k != this && !j.passive) {
                        var l = j._stepPosition;
                        k instanceof createjs.DisplayObject ? this._addManagedChild(k, l) : this._setState(k.state, l)
                    }
                }
                var m = this.children;
                for (h = m.length - 1; h >= 0; h--) {
                    var n = m[h].id;
                    1 == this._managed[n] && (this.removeChildAt(h), delete this._managed[n])
                }
            }
        }, c._setState = function(a, b) {
            if (a)
                for (var c = a.length - 1; c >= 0; c--) {
                    var d = a[c],
                        e = d.t,
                        f = d.p;
                    for (var g in f) e[g] = f[g];
                    this._addManagedChild(e, b)
                }
        }, c._addManagedChild = function(b, c) {
            b._off || (this.addChildAt(b, 0), b instanceof a && (b._synchOffset = c, b.mode == a.INDEPENDENT && b.autoReset && !this._managed[b.id] && b._reset()), this._managed[b.id] = 2)
        }, c._getBounds = function(a, b) {
            var c = this.DisplayObject_getBounds();
            return c || (this._updateTimeline(), this.frameBounds && (c = this._rectangle.copy(this.frameBounds[this.currentFrame]))), c ? this._transformBounds(c, a, b) : this.Container__getBounds(a, b)
        }, createjs.MovieClip = createjs.promote(a, "Container"), b.priority = 100, b.install = function() {
            createjs.Tween.installPlugin(b, ["startPosition"])
        }, b.init = function(a, b, c) {
            return c
        }, b.step = function() {}, b.tween = function(b, c, d, e, f, g) {
            return b.target instanceof a ? 1 == g ? f[c] : e[c] : d
        }
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            throw "SpriteSheetUtils cannot be instantiated"
        }
        var b = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        b.getContext && (a._workingCanvas = b, a._workingContext = b.getContext("2d"), b.width = b.height = 1), a.addFlippedFrames = function(b, c, d, e) {
            if (c || d || e) {
                var f = 0;
                c && a._flip(b, ++f, !0, !1), d && a._flip(b, ++f, !1, !0), e && a._flip(b, ++f, !0, !0)
            }
        }, a.extractFrame = function(b, c) {
            isNaN(c) && (c = b.getAnimation(c).frames[0]);
            var d = b.getFrame(c);
            if (!d) return null;
            var e = d.rect,
                f = a._workingCanvas;
            f.width = e.width, f.height = e.height, a._workingContext.drawImage(d.image, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height);
            var g = document.createElement("img");
            return g.src = f.toDataURL("image/png"), g
        }, a.mergeAlpha = function(a, b, c) {
            c || (c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")), c.width = Math.max(b.width, a.width), c.height = Math.max(b.height, a.height);
            var d = c.getContext("2d");
            return d.save(), d.drawImage(a, 0, 0), d.globalCompositeOperation = "destination-in", d.drawImage(b, 0, 0), d.restore(), c
        }, a._flip = function(b, c, d, e) {
            for (var f = b._images, g = a._workingCanvas, h = a._workingContext, i = f.length / c, j = 0; i > j; j++) {
                var k = f[j];
                k.__tmp = j, h.setTransform(1, 0, 0, 1, 0, 0), h.clearRect(0, 0, g.width + 1, g.height + 1), g.width = k.width, g.height = k.height, h.setTransform(d ? -1 : 1, 0, 0, e ? -1 : 1, d ? k.width : 0, e ? k.height : 0), h.drawImage(k, 0, 0);
                var l = document.createElement("img");
                l.src = g.toDataURL("image/png"), l.width = k.width, l.height = k.height, f.push(l)
            }
            var m = b._frames,
                n = m.length / c;
            for (j = 0; n > j; j++) {
                k = m[j];
                var o = k.rect.clone();
                l = f[k.image.__tmp + i * c];
                var p = {
                    image: l,
                    rect: o,
                    regX: k.regX,
                    regY: k.regY
                };
                d && (o.x = l.width - o.x - o.width, p.regX = o.width - k.regX), e && (o.y = l.height - o.y - o.height, p.regY = o.height - k.regY), m.push(p)
            }
            var q = "_" + (d ? "h" : "") + (e ? "v" : ""),
                r = b._animations,
                s = b._data,
                t = r.length / c;
            for (j = 0; t > j; j++) {
                var u = r[j];
                k = s[u];
                var v = {
                    name: u + q,
                    speed: k.speed,
                    next: k.next,
                    frames: []
                };
                k.next && (v.next += q), m = k.frames;
                for (var w = 0, x = m.length; x > w; w++) v.frames.push(m[w] + n * c);
                s[v.name] = v, r.push(v.name)
            }
        }, createjs.SpriteSheetUtils = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.EventDispatcher_constructor(), this.maxWidth = 2048, this.maxHeight = 2048, this.spriteSheet = null, this.scale = 1, this.padding = 1, this.timeSlice = .3, this.progress = -1, this.framerate = a || 0, this._frames = [], this._animations = {}, this._data = null, this._nextFrameIndex = 0, this._index = 0, this._timerID = null, this._scale = 1
        }
        var b = createjs.extend(a, createjs.EventDispatcher);
        a.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions", a.ERR_RUNNING = "a build is already running", b.addFrame = function(b, c, d, e, f) {
            if (this._data) throw a.ERR_RUNNING;
            var g = c || b.bounds || b.nominalBounds;
            return !g && b.getBounds && (g = b.getBounds()), g ? (d = d || 1, this._frames.push({
                source: b,
                sourceRect: g,
                scale: d,
                funct: e,
                data: f,
                index: this._frames.length,
                height: g.height * d
            }) - 1) : null
        }, b.addAnimation = function(b, c, d, e) {
            if (this._data) throw a.ERR_RUNNING;
            this._animations[b] = {
                frames: c,
                next: d,
                speed: e
            }
        }, b.addMovieClip = function(b, c, d, e, f, g) {
            if (this._data) throw a.ERR_RUNNING;
            var h = b.frameBounds,
                i = c || b.bounds || b.nominalBounds;
            if (!i && b.getBounds && (i = b.getBounds()), i || h) {
                var j, k, l = this._frames.length,
                    m = b.timeline.duration;
                for (j = 0; m > j; j++) {
                    var n = h && h[j] ? h[j] : i;
                    this.addFrame(b, n, d, this._setupMovieClipFrame, {
                        i: j,
                        f: e,
                        d: f
                    })
                }
                var o = b.timeline._labels,
                    p = [];
                for (var q in o) p.push({
                    index: o[q],
                    label: q
                });
                if (p.length)
                    for (p.sort(function(a, b) {
                            return a.index - b.index
                        }), j = 0, k = p.length; k > j; j++) {
                        for (var r = p[j].label, s = l + p[j].index, t = l + (j == k - 1 ? m : p[j + 1].index), u = [], v = s; t > v; v++) u.push(v);
                        (!g || (r = g(r, b, s, t))) && this.addAnimation(r, u, !0)
                    }
            }
        }, b.build = function() {
            if (this._data) throw a.ERR_RUNNING;
            for (this._startBuild(); this._drawNext(););
            return this._endBuild(), this.spriteSheet
        }, b.buildAsync = function(b) {
            if (this._data) throw a.ERR_RUNNING;
            this.timeSlice = b, this._startBuild();
            var c = this;
            this._timerID = setTimeout(function() {
                c._run()
            }, 50 - 50 * Math.max(1, Math.min(30, this.timeSlice || 30)))
        }, b.stopAsync = function() {
            clearTimeout(this._timerID), this._data = null
        }, b.clone = function() {
            throw "SpriteSheetBuilder cannot be cloned."
        }, b.toString = function() {
            return "[SpriteSheetBuilder]"
        }, b._startBuild = function() {
            var b = this.padding || 0;
            this.progress = 0, this.spriteSheet = null, this._index = 0, this._scale = this.scale;
            var c = [];
            this._data = {
                images: [],
                frames: c,
                framerate: this.framerate,
                animations: this._animations
            };
            var d = this._frames.slice();
            if (d.sort(function(a, b) {
                    return a.height <= b.height ? -1 : 1
                }), d[d.length - 1].height + 2 * b > this.maxHeight) throw a.ERR_DIMENSIONS;
            for (var e = 0, f = 0, g = 0; d.length;) {
                var h = this._fillRow(d, e, g, c, b);
                if (h.w > f && (f = h.w), e += h.h, !h.h || !d.length) {
                    var i = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
                    i.width = this._getSize(f, this.maxWidth), i.height = this._getSize(e, this.maxHeight), this._data.images[g] = i, h.h || (f = e = 0, g++)
                }
            }
        }, b._setupMovieClipFrame = function(a, b) {
            var c = a.actionsEnabled;
            a.actionsEnabled = !1, a.gotoAndStop(b.i), a.actionsEnabled = c, b.f && b.f(a, b.d, b.i)
        }, b._getSize = function(a, b) {
            for (var c = 4; Math.pow(2, ++c) < a;);
            return Math.min(b, Math.pow(2, c))
        }, b._fillRow = function(b, c, d, e, f) {
            var g = this.maxWidth,
                h = this.maxHeight;
            c += f;
            for (var i = h - c, j = f, k = 0, l = b.length - 1; l >= 0; l--) {
                var m = b[l],
                    n = this._scale * m.scale,
                    o = m.sourceRect,
                    p = m.source,
                    q = Math.floor(n * o.x - f),
                    r = Math.floor(n * o.y - f),
                    s = Math.ceil(n * o.height + 2 * f),
                    t = Math.ceil(n * o.width + 2 * f);
                if (t > g) throw a.ERR_DIMENSIONS;
                s > i || j + t > g || (m.img = d, m.rect = new createjs.Rectangle(j, c, t, s), k = k || s, b.splice(l, 1), e[m.index] = [j, c, t, s, d, Math.round(-q + n * p.regX - f), Math.round(-r + n * p.regY - f)], j += t)
            }
            return {
                w: j,
                h: k
            }
        }, b._endBuild = function() {
            this.spriteSheet = new createjs.SpriteSheet(this._data), this._data = null, this.progress = 1, this.dispatchEvent("complete")
        }, b._run = function() {
            for (var a = 50 * Math.max(.01, Math.min(.99, this.timeSlice || .3)), b = (new Date).getTime() + a, c = !1; b > (new Date).getTime();)
                if (!this._drawNext()) {
                    c = !0;
                    break
                }
            if (c) this._endBuild();
            else {
                var d = this;
                this._timerID = setTimeout(function() {
                    d._run()
                }, 50 - a)
            }
            var e = this.progress = this._index / this._frames.length;
            if (this.hasEventListener("progress")) {
                var f = new createjs.Event("progress");
                f.progress = e, this.dispatchEvent(f)
            }
        }, b._drawNext = function() {
            var a = this._frames[this._index],
                b = a.scale * this._scale,
                c = a.rect,
                d = a.sourceRect,
                e = this._data.images[a.img],
                f = e.getContext("2d");
            return a.funct && a.funct(a.source, a.data), f.save(), f.beginPath(), f.rect(c.x, c.y, c.width, c.height), f.clip(), f.translate(Math.ceil(c.x - d.x * b), Math.ceil(c.y - d.y * b)), f.scale(b, b), a.source.draw(f), f.restore(), ++this._index < this._frames.length
        }, createjs.SpriteSheetBuilder = createjs.promote(a, "EventDispatcher")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.DisplayObject_constructor(), "string" == typeof a && (a = document.getElementById(a)), this.mouseEnabled = !1;
            var b = a.style;
            b.position = "absolute", b.transformOrigin = b.WebkitTransformOrigin = b.msTransformOrigin = b.MozTransformOrigin = b.OTransformOrigin = "0% 0%", this.htmlElement = a, this._oldProps = null
        }
        var b = createjs.extend(a, createjs.DisplayObject);
        b.isVisible = function() {
            return null != this.htmlElement
        }, b.draw = function() {
            return !0
        }, b.cache = function() {}, b.uncache = function() {}, b.updateCache = function() {}, b.hitTest = function() {}, b.localToGlobal = function() {}, b.globalToLocal = function() {}, b.localToLocal = function() {}, b.clone = function() {
            throw "DOMElement cannot be cloned."
        }, b.toString = function() {
            return "[DOMElement (name=" + this.name + ")]"
        }, b._tick = function(a) {
            var b = this.getStage();
            b && b.on("drawend", this._handleDrawEnd, this, !0), this.DisplayObject__tick(a)
        }, b._handleDrawEnd = function() {
            var a = this.htmlElement;
            if (a) {
                var b = a.style,
                    c = this.getConcatenatedDisplayProps(this._props),
                    d = c.matrix,
                    e = c.visible ? "visible" : "hidden";
                if (e != b.visibility && (b.visibility = e), c.visible) {
                    var f = this._oldProps,
                        g = f && f.matrix,
                        h = 1e4;
                    if (!g || !g.equals(d)) {
                        var i = "matrix(" + (d.a * h | 0) / h + "," + (d.b * h | 0) / h + "," + (d.c * h | 0) / h + "," + (d.d * h | 0) / h + "," + (d.tx + .5 | 0);
                        b.transform = b.WebkitTransform = b.OTransform = b.msTransform = i + "," + (d.ty + .5 | 0) + ")", b.MozTransform = i + "px," + (d.ty + .5 | 0) + "px)", f || (f = this._oldProps = new createjs.DisplayProps(!0, 0 / 0)), f.matrix.copy(d)
                    }
                    f.alpha != c.alpha && (b.opacity = "" + (c.alpha * h | 0) / h, f.alpha = c.alpha)
                }
            }
        }, createjs.DOMElement = createjs.promote(a, "DisplayObject")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {}
        var b = a.prototype;
        b.getBounds = function(a) {
            return a
        }, b.applyFilter = function(a, b, c, d, e, f, g, h) {
            f = f || a, null == g && (g = b), null == h && (h = c);
            try {
                var i = a.getImageData(b, c, d, e)
            } catch (j) {
                return !1
            }
            return this._applyFilter(i) ? (f.putImageData(i, g, h), !0) : !1
        }, b.toString = function() {
            return "[Filter]"
        }, b.clone = function() {
            return new a
        }, b._applyFilter = function() {
            return !0
        }, createjs.Filter = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            (isNaN(a) || 0 > a) && (a = 0), (isNaN(b) || 0 > b) && (b = 0), (isNaN(c) || 1 > c) && (c = 1), this.blurX = 0 | a, this.blurY = 0 | b, this.quality = 0 | c
        }
        var b = createjs.extend(a, createjs.Filter);
        a.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1], a.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9], b.getBounds = function(a) {
            var b = 0 | this.blurX,
                c = 0 | this.blurY;
            if (0 >= b && 0 >= c) return a;
            var d = Math.pow(this.quality, .2);
            return (a || new createjs.Rectangle).pad(b * d + 1, c * d + 1, b * d + 1, c * d + 1)
        }, b.clone = function() {
            return new a(this.blurX, this.blurY, this.quality)
        }, b.toString = function() {
            return "[BlurFilter]"
        }, b._applyFilter = function(b) {
            var c = this.blurX >> 1;
            if (isNaN(c) || 0 > c) return !1;
            var d = this.blurY >> 1;
            if (isNaN(d) || 0 > d) return !1;
            if (0 == c && 0 == d) return !1;
            var e = this.quality;
            (isNaN(e) || 1 > e) && (e = 1), e |= 0, e > 3 && (e = 3), 1 > e && (e = 1);
            var f = b.data,
                g = 0,
                h = 0,
                i = 0,
                j = 0,
                k = 0,
                l = 0,
                m = 0,
                n = 0,
                o = 0,
                p = 0,
                q = 0,
                r = 0,
                s = 0,
                t = 0,
                u = 0,
                v = c + c + 1 | 0,
                w = d + d + 1 | 0,
                x = 0 | b.width,
                y = 0 | b.height,
                z = x - 1 | 0,
                A = y - 1 | 0,
                B = c + 1 | 0,
                C = d + 1 | 0,
                D = {
                    r: 0,
                    b: 0,
                    g: 0,
                    a: 0
                },
                E = D;
            for (i = 1; v > i; i++) E = E.n = {
                r: 0,
                b: 0,
                g: 0,
                a: 0
            };
            E.n = D;
            var F = {
                    r: 0,
                    b: 0,
                    g: 0,
                    a: 0
                },
                G = F;
            for (i = 1; w > i; i++) G = G.n = {
                r: 0,
                b: 0,
                g: 0,
                a: 0
            };
            G.n = F;
            for (var H = null, I = 0 | a.MUL_TABLE[c], J = 0 | a.SHG_TABLE[c], K = 0 | a.MUL_TABLE[d], L = 0 | a.SHG_TABLE[d]; e-- > 0;) {
                m = l = 0;
                var M = I,
                    N = J;
                for (h = y; --h > -1;) {
                    for (n = B * (r = f[0 | l]), o = B * (s = f[l + 1 | 0]), p = B * (t = f[l + 2 | 0]), q = B * (u = f[l + 3 | 0]), E = D, i = B; --i > -1;) E.r = r, E.g = s, E.b = t, E.a = u, E = E.n;
                    for (i = 1; B > i; i++) j = l + ((i > z ? z : i) << 2) | 0, n += E.r = f[j], o += E.g = f[j + 1], p += E.b = f[j + 2], q += E.a = f[j + 3], E = E.n;
                    for (H = D, g = 0; x > g; g++) f[l++] = n * M >>> N, f[l++] = o * M >>> N, f[l++] = p * M >>> N, f[l++] = q * M >>> N, j = m + ((j = g + c + 1) < z ? j : z) << 2, n -= H.r - (H.r = f[j]), o -= H.g - (H.g = f[j + 1]), p -= H.b - (H.b = f[j + 2]), q -= H.a - (H.a = f[j + 3]), H = H.n;
                    m += x
                }
                for (M = K, N = L, g = 0; x > g; g++) {
                    for (l = g << 2 | 0, n = C * (r = f[l]) | 0, o = C * (s = f[l + 1 | 0]) | 0, p = C * (t = f[l + 2 | 0]) | 0, q = C * (u = f[l + 3 | 0]) | 0, G = F, i = 0; C > i; i++) G.r = r, G.g = s, G.b = t, G.a = u, G = G.n;
                    for (k = x, i = 1; d >= i; i++) l = k + g << 2, n += G.r = f[l], o += G.g = f[l + 1], p += G.b = f[l + 2], q += G.a = f[l + 3], G = G.n, A > i && (k += x);
                    if (l = g, H = F, e > 0)
                        for (h = 0; y > h; h++) j = l << 2, f[j + 3] = u = q * M >>> N, u > 0 ? (f[j] = n * M >>> N, f[j + 1] = o * M >>> N, f[j + 2] = p * M >>> N) : f[j] = f[j + 1] = f[j + 2] = 0, j = g + ((j = h + C) < A ? j : A) * x << 2, n -= H.r - (H.r = f[j]), o -= H.g - (H.g = f[j + 1]), p -= H.b - (H.b = f[j + 2]), q -= H.a - (H.a = f[j + 3]), H = H.n, l += x;
                    else
                        for (h = 0; y > h; h++) j = l << 2, f[j + 3] = u = q * M >>> N, u > 0 ? (u = 255 / u, f[j] = (n * M >>> N) * u, f[j + 1] = (o * M >>> N) * u, f[j + 2] = (p * M >>> N) * u) : f[j] = f[j + 1] = f[j + 2] = 0, j = g + ((j = h + C) < A ? j : A) * x << 2, n -= H.r - (H.r = f[j]), o -= H.g - (H.g = f[j + 1]), p -= H.b - (H.b = f[j + 2]), q -= H.a - (H.a = f[j + 3]), H = H.n, l += x
                }
            }
            return !0
        }, createjs.BlurFilter = createjs.promote(a, "Filter")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.alphaMap = a, this._alphaMap = null, this._mapData = null
        }
        var b = createjs.extend(a, createjs.Filter);
        b.clone = function() {
            var b = new a(this.alphaMap);
            return b._alphaMap = this._alphaMap, b._mapData = this._mapData, b
        }, b.toString = function() {
            return "[AlphaMapFilter]"
        }, b._applyFilter = function(a) {
            if (!this.alphaMap) return !0;
            if (!this._prepAlphaMap()) return !1;
            for (var b = a.data, c = this._mapData, d = 0, e = b.length; e > d; d += 4) b[d + 3] = c[d] || 0;
            return !0
        }, b._prepAlphaMap = function() {
            if (!this.alphaMap) return !1;
            if (this.alphaMap == this._alphaMap && this._mapData) return !0;
            this._mapData = null;
            var a, b = this._alphaMap = this.alphaMap,
                c = b;
            b instanceof HTMLCanvasElement ? a = c.getContext("2d") : (c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"), c.width = b.width, c.height = b.height, a = c.getContext("2d"), a.drawImage(b, 0, 0));
            try {
                var d = a.getImageData(0, 0, b.width, b.height)
            } catch (e) {
                return !1
            }
            return this._mapData = d.data, !0
        }, createjs.AlphaMapFilter = createjs.promote(a, "Filter")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.mask = a
        }
        var b = createjs.extend(a, createjs.Filter);
        b.applyFilter = function(a, b, c, d, e, f, g, h) {
            return this.mask ? (f = f || a, null == g && (g = b), null == h && (h = c), f.save(), a != f ? !1 : (f.globalCompositeOperation = "destination-in", f.drawImage(this.mask, g, h), f.restore(), !0)) : !0
        }, b.clone = function() {
            return new a(this.mask)
        }, b.toString = function() {
            return "[AlphaMaskFilter]"
        }, createjs.AlphaMaskFilter = createjs.promote(a, "Filter")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d, e, f, g, h) {
            this.redMultiplier = null != a ? a : 1, this.greenMultiplier = null != b ? b : 1, this.blueMultiplier = null != c ? c : 1, this.alphaMultiplier = null != d ? d : 1, this.redOffset = e || 0, this.greenOffset = f || 0, this.blueOffset = g || 0, this.alphaOffset = h || 0
        }
        var b = createjs.extend(a, createjs.Filter);
        b.toString = function() {
            return "[ColorFilter]"
        }, b.clone = function() {
            return new a(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset)
        }, b._applyFilter = function(a) {
            for (var b = a.data, c = b.length, d = 0; c > d; d += 4) b[d] = b[d] * this.redMultiplier + this.redOffset, b[d + 1] = b[d + 1] * this.greenMultiplier + this.greenOffset, b[d + 2] = b[d + 2] * this.blueMultiplier + this.blueOffset, b[d + 3] = b[d + 3] * this.alphaMultiplier + this.alphaOffset;
            return !0
        }, createjs.ColorFilter = createjs.promote(a, "Filter")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c, d) {
            this.setColor(a, b, c, d)
        }
        var b = a.prototype;
        a.DELTA_INDEX = [0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10], a.IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], a.LENGTH = a.IDENTITY_MATRIX.length, b.setColor = function(a, b, c, d) {
            return this.reset().adjustColor(a, b, c, d)
        }, b.reset = function() {
            return this.copy(a.IDENTITY_MATRIX)
        }, b.adjustColor = function(a, b, c, d) {
            return this.adjustHue(d), this.adjustContrast(b), this.adjustBrightness(a), this.adjustSaturation(c)
        }, b.adjustBrightness = function(a) {
            return 0 == a || isNaN(a) ? this : (a = this._cleanValue(a, 255), this._multiplyMatrix([1, 0, 0, 0, a, 0, 1, 0, 0, a, 0, 0, 1, 0, a, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this)
        }, b.adjustContrast = function(b) {
            if (0 == b || isNaN(b)) return this;
            b = this._cleanValue(b, 100);
            var c;
            return 0 > b ? c = 127 + b / 100 * 127 : (c = b % 1, c = 0 == c ? a.DELTA_INDEX[b] : a.DELTA_INDEX[b << 0] * (1 - c) + a.DELTA_INDEX[(b << 0) + 1] * c, c = 127 * c + 127), this._multiplyMatrix([c / 127, 0, 0, 0, .5 * (127 - c), 0, c / 127, 0, 0, .5 * (127 - c), 0, 0, c / 127, 0, .5 * (127 - c), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this
        }, b.adjustSaturation = function(a) {
            if (0 == a || isNaN(a)) return this;
            a = this._cleanValue(a, 100);
            var b = 1 + (a > 0 ? 10 * a / 100 : a / 100),
                c = .3086,
                d = .6094,
                e = .082;
            return this._multiplyMatrix([c * (1 - b) + b, d * (1 - b), e * (1 - b), 0, 0, c * (1 - b), d * (1 - b) + b, e * (1 - b), 0, 0, c * (1 - b), d * (1 - b), e * (1 - b) + b, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this
        }, b.adjustHue = function(a) {
            if (0 == a || isNaN(a)) return this;
            a = this._cleanValue(a, 180) / 180 * Math.PI;
            var b = Math.cos(a),
                c = Math.sin(a),
                d = .213,
                e = .715,
                f = .072;
            return this._multiplyMatrix([d + b * (1 - d) + c * -d, e + b * -e + c * -e, f + b * -f + c * (1 - f), 0, 0, d + b * -d + .143 * c, e + b * (1 - e) + .14 * c, f + b * -f + c * -.283, 0, 0, d + b * -d + c * -(1 - d), e + b * -e + c * e, f + b * (1 - f) + c * f, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]), this
        }, b.concat = function(b) {
            return b = this._fixMatrix(b), b.length != a.LENGTH ? this : (this._multiplyMatrix(b), this)
        }, b.clone = function() {
            return (new a).copy(this)
        }, b.toArray = function() {
            for (var b = [], c = 0, d = a.LENGTH; d > c; c++) b[c] = this[c];
            return b
        }, b.copy = function(b) {
            for (var c = a.LENGTH, d = 0; c > d; d++) this[d] = b[d];
            return this
        }, b.toString = function() {
            return "[ColorMatrix]"
        }, b._multiplyMatrix = function(a) {
            var b, c, d, e = [];
            for (b = 0; 5 > b; b++) {
                for (c = 0; 5 > c; c++) e[c] = this[c + 5 * b];
                for (c = 0; 5 > c; c++) {
                    var f = 0;
                    for (d = 0; 5 > d; d++) f += a[c + 5 * d] * e[d];
                    this[c + 5 * b] = f
                }
            }
        }, b._cleanValue = function(a, b) {
            return Math.min(b, Math.max(-b, a))
        }, b._fixMatrix = function(b) {
            return b instanceof a && (b = b.toArray()), b.length < a.LENGTH ? b = b.slice(0, b.length).concat(a.IDENTITY_MATRIX.slice(b.length, a.LENGTH)) : b.length > a.LENGTH && (b = b.slice(0, a.LENGTH)), b
        }, createjs.ColorMatrix = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.matrix = a
        }
        var b = createjs.extend(a, createjs.Filter);
        b.toString = function() {
            return "[ColorMatrixFilter]"
        }, b.clone = function() {
            return new a(this.matrix)
        }, b._applyFilter = function(a) {
            for (var b, c, d, e, f = a.data, g = f.length, h = this.matrix, i = h[0], j = h[1], k = h[2], l = h[3], m = h[4], n = h[5], o = h[6], p = h[7], q = h[8], r = h[9], s = h[10], t = h[11], u = h[12], v = h[13], w = h[14], x = h[15], y = h[16], z = h[17], A = h[18], B = h[19], C = 0; g > C; C += 4) b = f[C], c = f[C + 1], d = f[C + 2], e = f[C + 3], f[C] = b * i + c * j + d * k + e * l + m, f[C + 1] = b * n + c * o + d * p + e * q + r, f[C + 2] = b * s + c * t + d * u + e * v + w, f[C + 3] = b * x + c * y + d * z + e * A + B;
            return !0
        }, createjs.ColorMatrixFilter = createjs.promote(a, "Filter")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            throw "Touch cannot be instantiated"
        }
        a.isSupported = function() {
            return !!("ontouchstart" in window || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0)
        }, a.enable = function(b, c, d) {
            return b && b.canvas && a.isSupported() ? b.__touch ? !0 : (b.__touch = {
                pointers: {},
                multitouch: !c,
                preventDefault: !d,
                count: 0
            }, "ontouchstart" in window ? a._IOS_enable(b) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && a._IE_enable(b), !0) : !1
        }, a.disable = function(b) {
            b && ("ontouchstart" in window ? a._IOS_disable(b) : (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && a._IE_disable(b), delete b.__touch)
        }, a._IOS_enable = function(b) {
            var c = b.canvas,
                d = b.__touch.f = function(c) {
                    a._IOS_handleEvent(b, c)
                };
            c.addEventListener("touchstart", d, !1), c.addEventListener("touchmove", d, !1), c.addEventListener("touchend", d, !1), c.addEventListener("touchcancel", d, !1)
        }, a._IOS_disable = function(a) {
            var b = a.canvas;
            if (b) {
                var c = a.__touch.f;
                b.removeEventListener("touchstart", c, !1), b.removeEventListener("touchmove", c, !1), b.removeEventListener("touchend", c, !1), b.removeEventListener("touchcancel", c, !1)
            }
        }, a._IOS_handleEvent = function(a, b) {
            if (a) {
                a.__touch.preventDefault && b.preventDefault && b.preventDefault();
                for (var c = b.changedTouches, d = b.type, e = 0, f = c.length; f > e; e++) {
                    var g = c[e],
                        h = g.identifier;
                    g.target == a.canvas && ("touchstart" == d ? this._handleStart(a, h, b, g.pageX, g.pageY) : "touchmove" == d ? this._handleMove(a, h, b, g.pageX, g.pageY) : ("touchend" == d || "touchcancel" == d) && this._handleEnd(a, h, b))
                }
            }
        }, a._IE_enable = function(b) {
            var c = b.canvas,
                d = b.__touch.f = function(c) {
                    a._IE_handleEvent(b, c)
                };
            void 0 === window.navigator.pointerEnabled ? (c.addEventListener("MSPointerDown", d, !1), window.addEventListener("MSPointerMove", d, !1), window.addEventListener("MSPointerUp", d, !1), window.addEventListener("MSPointerCancel", d, !1), b.__touch.preventDefault && (c.style.msTouchAction = "none")) : (c.addEventListener("pointerdown", d, !1), window.addEventListener("pointermove", d, !1), window.addEventListener("pointerup", d, !1), window.addEventListener("pointercancel", d, !1), b.__touch.preventDefault && (c.style.touchAction = "none")), b.__touch.activeIDs = {}
        }, a._IE_disable = function(a) {
            var b = a.__touch.f;
            void 0 === window.navigator.pointerEnabled ? (window.removeEventListener("MSPointerMove", b, !1), window.removeEventListener("MSPointerUp", b, !1), window.removeEventListener("MSPointerCancel", b, !1), a.canvas && a.canvas.removeEventListener("MSPointerDown", b, !1)) : (window.removeEventListener("pointermove", b, !1), window.removeEventListener("pointerup", b, !1), window.removeEventListener("pointercancel", b, !1), a.canvas && a.canvas.removeEventListener("pointerdown", b, !1))
        }, a._IE_handleEvent = function(a, b) {
            if (a) {
                a.__touch.preventDefault && b.preventDefault && b.preventDefault();
                var c = b.type,
                    d = b.pointerId,
                    e = a.__touch.activeIDs;
                if ("MSPointerDown" == c || "pointerdown" == c) {
                    if (b.srcElement != a.canvas) return;
                    e[d] = !0, this._handleStart(a, d, b, b.pageX, b.pageY)
                } else e[d] && ("MSPointerMove" == c || "pointermove" == c ? this._handleMove(a, d, b, b.pageX, b.pageY) : ("MSPointerUp" == c || "MSPointerCancel" == c || "pointerup" == c || "pointercancel" == c) && (delete e[d], this._handleEnd(a, d, b)))
            }
        }, a._handleStart = function(a, b, c, d, e) {
            var f = a.__touch;
            if (f.multitouch || !f.count) {
                var g = f.pointers;
                g[b] || (g[b] = !0, f.count++, a._handlePointerDown(b, c, d, e))
            }
        }, a._handleMove = function(a, b, c, d, e) {
            a.__touch.pointers[b] && a._handlePointerMove(b, c, d, e)
        }, a._handleEnd = function(a, b, c) {
            var d = a.__touch,
                e = d.pointers;
            e[b] && (d.count--, a._handlePointerUp(b, c, !0), delete e[b])
        }, createjs.Touch = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";
        var a = createjs.EaselJS = createjs.EaselJS || {};
        a.version = "0.8.2", a.buildDate = "Thu, 26 Nov 2015 20:44:34 GMT"
    }();

! function(t) {
    function o(t, o, r) {
        this.x = t, this.y = o, this.z = r
    }

    function r(t) {
        return t * t * t * (t * (6 * t - 15) + 10)
    }

    function n(t, o, r) {
        return (1 - r) * t + r * o
    }
    var a = t.noise = {};
    o.prototype.dot2 = function(t, o) {
        return this.x * t + this.y * o
    }, o.prototype.dot3 = function(t, o, r) {
        return this.x * t + this.y * o + this.z * r
    };
    var e = [new o(1, 1, 0), new o(-1, 1, 0), new o(1, -1, 0), new o(-1, -1, 0), new o(1, 0, 1), new o(-1, 0, 1), new o(1, 0, -1), new o(-1, 0, -1), new o(0, 1, 1), new o(0, -1, 1), new o(0, 1, -1), new o(0, -1, -1)],
        i = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
        d = new Array(512),
        f = new Array(512);
    a.seed = function(t) {
        t > 0 && 1 > t && (t *= 65536), t = Math.floor(t), 256 > t && (t |= t << 8);
        for (var o = 0; 256 > o; o++) {
            var r;
            r = 1 & o ? i[o] ^ 255 & t : i[o] ^ t >> 8 & 255, d[o] = d[o + 256] = r, f[o] = f[o + 256] = e[r % 12]
        }
    }, a.seed(0);
    var h = .5 * (Math.sqrt(3) - 1),
        v = (3 - Math.sqrt(3)) / 6,
        u = 1 / 3,
        s = 1 / 6;
    a.simplex2 = function(t, o) {
        var r, n, a, e, i, u = (t + o) * h,
            s = Math.floor(t + u),
            l = Math.floor(o + u),
            w = (s + l) * v,
            M = t - s + w,
            c = o - l + w;
        M > c ? (e = 1, i = 0) : (e = 0, i = 1);
        var p = M - e + v,
            y = c - i + v,
            x = M - 1 + 2 * v,
            m = c - 1 + 2 * v;
        s &= 255, l &= 255;
        var q = f[s + d[l]],
            z = f[s + e + d[l + i]],
            A = f[s + 1 + d[l + 1]],
            b = .5 - M * M - c * c;
        0 > b ? r = 0 : (b *= b, r = b * b * q.dot2(M, c));
        var g = .5 - p * p - y * y;
        0 > g ? n = 0 : (g *= g, n = g * g * z.dot2(p, y));
        var j = .5 - x * x - m * m;
        return 0 > j ? a = 0 : (j *= j, a = j * j * A.dot2(x, m)), 70 * (r + n + a)
    }, a.simplex3 = function(t, o, r) {
        var n, a, e, i, h, v, l, w, M, c, p = (t + o + r) * u,
            y = Math.floor(t + p),
            x = Math.floor(o + p),
            m = Math.floor(r + p),
            q = (y + x + m) * s,
            z = t - y + q,
            A = o - x + q,
            b = r - m + q;
        z >= A ? A >= b ? (h = 1, v = 0, l = 0, w = 1, M = 1, c = 0) : z >= b ? (h = 1, v = 0, l = 0, w = 1, M = 0, c = 1) : (h = 0, v = 0, l = 1, w = 1, M = 0, c = 1) : b > A ? (h = 0, v = 0, l = 1, w = 0, M = 1, c = 1) : b > z ? (h = 0, v = 1, l = 0, w = 0, M = 1, c = 1) : (h = 0, v = 1, l = 0, w = 1, M = 1, c = 0);
        var g = z - h + s,
            j = A - v + s,
            k = b - l + s,
            B = z - w + 2 * s,
            C = A - M + 2 * s,
            D = b - c + 2 * s,
            E = z - 1 + 3 * s,
            F = A - 1 + 3 * s,
            G = b - 1 + 3 * s;
        y &= 255, x &= 255, m &= 255;
        var H = f[y + d[x + d[m]]],
            I = f[y + h + d[x + v + d[m + l]]],
            J = f[y + w + d[x + M + d[m + c]]],
            K = f[y + 1 + d[x + 1 + d[m + 1]]],
            L = .6 - z * z - A * A - b * b;
        0 > L ? n = 0 : (L *= L, n = L * L * H.dot3(z, A, b));
        var N = .6 - g * g - j * j - k * k;
        0 > N ? a = 0 : (N *= N, a = N * N * I.dot3(g, j, k));
        var O = .6 - B * B - C * C - D * D;
        0 > O ? e = 0 : (O *= O, e = O * O * J.dot3(B, C, D));
        var P = .6 - E * E - F * F - G * G;
        return 0 > P ? i = 0 : (P *= P, i = P * P * K.dot3(E, F, G)), 32 * (n + a + e + i)
    }, a.perlin2 = function(t, o) {
        var a = Math.floor(t),
            e = Math.floor(o);
        t -= a, o -= e, a = 255 & a, e = 255 & e;
        var i = f[a + d[e]].dot2(t, o),
            h = f[a + d[e + 1]].dot2(t, o - 1),
            v = f[a + 1 + d[e]].dot2(t - 1, o),
            u = f[a + 1 + d[e + 1]].dot2(t - 1, o - 1),
            s = r(t);
        return n(n(i, v, s), n(h, u, s), r(o))
    }, a.perlin3 = function(t, o, a) {
        var e = Math.floor(t),
            i = Math.floor(o),
            h = Math.floor(a);
        t -= e, o -= i, a -= h, e = 255 & e, i = 255 & i, h = 255 & h;
        var v = f[e + d[i + d[h]]].dot3(t, o, a),
            u = f[e + d[i + d[h + 1]]].dot3(t, o, a - 1),
            s = f[e + d[i + 1 + d[h]]].dot3(t, o - 1, a),
            l = f[e + d[i + 1 + d[h + 1]]].dot3(t, o - 1, a - 1),
            w = f[e + 1 + d[i + d[h]]].dot3(t - 1, o, a),
            M = f[e + 1 + d[i + d[h + 1]]].dot3(t - 1, o, a - 1),
            c = f[e + 1 + d[i + 1 + d[h]]].dot3(t - 1, o - 1, a),
            p = f[e + 1 + d[i + 1 + d[h + 1]]].dot3(t - 1, o - 1, a - 1),
            y = r(t),
            x = r(o),
            m = r(a);
        return n(n(n(v, w, y), n(u, M, y), m), n(n(s, c, y), n(l, p, y), m), x)
    }
}(this);
var __extends = this && this.__extends || function(t, e) {
        function i() {
            this.constructor = t
        }
        for (var a in e) e.hasOwnProperty(a) && (t[a] = e[a]);
        t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i)
    },
    clockmaker;
! function(t) {
    "use strict";
    var e = function() {
        function t() {}
        return t.highDPI = function(e, i, a) {
            var r = t._getBackingRatio(e),
                s = Math.max(1, (window.devicePixelRatio || 1) / r),
                n = e.canvas;
            n.style;
            return n.width = i * s, n.height = a * s, e.scaleX = e.scaleY = s, this
        }, t._getBackingRatio = function(t) {
            var e = t.canvas.getContext("2d");
            return e.backingStorePixelRatio || e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || 1
        }, t
    }();
    t.StageHelper = e
}(clockmaker || (clockmaker = {}));
var project;
! function(t) {
    "use strict";
    var e = function(t) {
        function e() {
            t.call(this), this.time = 0, this.MAX_LINES = 10, this.MAX_VERTEX = 10, this.mouseEnabled = !1, noise.seed(0), this.vertexArr = [];
            for (var e = 0; e < this.MAX_LINES; e++) {
                this.vertexArr[e] = [];
                for (var i = (this.MAX_VERTEX - 1) * Math.random() * Math.random() + 1, a = 0; i >= a; a++) this.vertexArr[e][a] = 0
            }
            this.on("tick", this.handleTick, this)
        }
        return __extends(e, t), e.prototype.handleTick = function(t) {
            this.time = Date.now() / 5e3, this.graphics.clear();
            for (var e = 0; e < this.MAX_LINES; e++) this.drawWave(this.vertexArr[e], .05 * e + .001, .1 * e)
        }, e.prototype.drawWave = function(t, e, i) {
            var a = t.length - 1,
                r = window.innerWidth,
                s = window.innerHeight;
            this.graphics.setStrokeStyle(e).beginStroke("white");
            for (var n = 0; a >= n; n++) {
                var h = noise.perlin2(.2 * n, this.time + i);
                h *= .5, t[n] = h * innerHeight * 2
            }
            var o = s / 2,
                c = [];
            c.push({
                x: -200,
                y: o
            });
            for (var n = 0; a >= n; n++) c.push({
                x: r * (n / a) >> 0,
                y: t[n] + o
            });
            c.push({
                x: r + 200,
                y: o
            });
            for (var n = 0; n < c.length; n++)
                if (n >= 2) {
                    var l = c[n - 0].x,
                        p = c[n - 0].y,
                        d = c[n - 1].x,
                        g = c[n - 1].y,
                        u = c[n - 2].x,
                        v = c[n - 2].y,
                        f = (u + d) / 2,
                        m = (v + g) / 2,
                        y = (l + d) / 2,
                        _ = (p + g) / 2;
                    this.graphics.moveTo(f, m).curveTo(d, g, y, _)
                }
            this.graphics.endStroke()
        }, e
    }(createjs.Shape);
    t.CrossGraphicsContainer = e
}(project || (project = {}));
var project;
! function(t) {
    "use strict";
    var e = function(t) {
        function e() {
            t.call(this)
        }
        return __extends(e, t), e.prototype.drawContents = function(t, e) {
            this.graphics.clear(), this.graphics.beginFill(createjs.Graphics.getHSL(0, 0, 0)).drawRect(0, 0, t, e);
            var i = 1 * t / 3 + t / 10 * Math.sin(Date.now() / 4e3),
                a = 1 * e / 3,
                r = t / 2;
            this.graphics.beginRadialGradientFill([createjs.Graphics.getHSL(0, 0, 100, .3 + .008 * Math.random()), createjs.Graphics.getHSL(0, 0, 0, 0)], [0, 1], i, a, 0, i, a, r), this.graphics.drawCircle(i, a, r), this.graphics.endFill();
            var i = 3 * t / 4 + t / 15 * Math.cos(Date.now() / 1e4),
                a = 2 * e / 3,
                r = t / 3;
            this.graphics.beginRadialGradientFill([createjs.Graphics.getHSL(0, 0, 100, .3 + .006 * Math.random()), createjs.Graphics.getHSL(0, 0, 0, 0)], [0, 1], i, a, 0, i, a, r), this.graphics.drawCircle(i, a, r), this.graphics.endFill()
        }, e
    }(createjs.Shape);
    t.SpotLightContainer = e
}(project || (project = {}));
var project;

