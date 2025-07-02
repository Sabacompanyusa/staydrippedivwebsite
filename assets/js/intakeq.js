!function(e, n, t, o, a, i) {
    let r, c, s, l, u, d = this, p = Math.floor(1e4 * Math.random()), f = Function.prototype, h = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/, m = /[\-\w]+\/\.\.\//, g = /([^:])\/\//g, v = "", y = {}, w = e.easyXDM, k = "easyXDM_", b = !1;
    function x(e, n) {
        const t = typeof e[n];
        return "function" == t || !("object" != t || !e[n]) || "unknown" == t
    }
    function O() {
        let e, n = "Shockwave Flash", t = "application/x-shockwave-flash";
        if (!I(navigator.plugins) && "object" == typeof navigator.plugins[n]) {
            const o = navigator.plugins[n].description;
            o && !I(navigator.mimeTypes) && navigator.mimeTypes[t] && navigator.mimeTypes[t].enabledPlugin && (c = o.match(/\d+/g))
        }
        if (!c)
            try {
                e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),
                c = Array.prototype.slice.call(e.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1),
                e = null
            } catch (e) {}
        if (!c)
            return !1;
        const a = parseInt(c[0], 10)
          , i = parseInt(c[1], 10);
        return s = a > 9 && i > 0,
        !0
    }
    if (x(e, "addEventListener"))
        l = function(e, n, t) {
            e.addEventListener(n, t, !1)
        }
        ,
        u = function(e, n, t) {
            e.removeEventListener(n, t, !1)
        }
        ;
    else {
        if (!x(e, "attachEvent"))
            throw new Error("Browser not supported");
        l = function(e, n, t) {
            e.attachEvent("on" + n, t)
        }
        ,
        u = function(e, n, t) {
            e.detachEvent("on" + n, t)
        }
    }
    let _, M = !1, T = [];
    function E() {
        if (!M) {
            M = !0;
            for (let e = 0; e < T.length; e++)
                T[e]();
            T.length = 0
        }
    }
    if ("readyState"in n ? (_ = n.readyState,
    M = "complete" == _ || ~navigator.userAgent.indexOf("AppleWebKit/") && ("loaded" == _ || "interactive" == _)) : M = !!n.body,
    !M) {
        if (x(e, "addEventListener"))
            l(n, "DOMContentLoaded", E);
        else if (l(n, "readystatechange", (function() {
            "complete" == n.readyState && E()
        }
        )),
        n.documentElement.doScroll && e === top) {
            const S = function() {
                if (!M) {
                    try {
                        n.documentElement.doScroll("left")
                    } catch (e) {
                        return void o(S, 1)
                    }
                    E()
                }
            };
            S()
        }
        l(e, "load", E)
    }
    function C(e, n) {
        M ? e.call(n) : T.push((function() {
            e.call(n)
        }
        ))
    }
    function N(e) {
        return e.match(h)[3]
    }
    function P(n) {
        -1 === n.indexOf("http") && (n = e.parent.location.href);
        const t = n.toLowerCase().match(h);
        if (!t)
            return "";
        let o = t[2]
          , a = t[3]
          , i = t[4] || "";
        return ("http:" == o && ":80" == i || "https:" == o && ":443" == i) && (i = ""),
        o + "//" + a + i
    }
    function R(e) {
        if (!(e = e.replace(g, "$1/")).match(/^(http||https):\/\//)) {
            let n = "/" === e.substring(0, 1) ? "" : t.pathname;
            "/" !== n.substring(n.length - 1) && (n = n.substring(0, n.lastIndexOf("/") + 1)),
            e = t.protocol + "//" + t.host + n + e
        }
        for (; m.test(e); )
            e = e.replace(m, "");
        return e
    }
    function q(e, n) {
        let t = ""
          , o = e.indexOf("#");
        -1 !== o && (t = e.substring(o),
        e = e.substring(0, o));
        const a = [];
        for (const r in n)
            n.hasOwnProperty(r) && a.push(r + "=" + i(n[r]));
        return e + (b ? "#" : -1 == e.indexOf("?") ? "?" : "&") + a.join("&") + t
    }
    const F = function(e) {
        for (var n, t = {}, o = (e = e.substring(1).split("&")).length; o--; )
            t[(n = e[o].split("="))[0]] = a(n[1]);
        return t
    }(/xdm_e=/.test(t.search) ? t.search : t.hash);
    function I(e) {
        return void 0 === e
    }
    let B, H = function() {
        let e = {}
          , n = {
            a: [1, 2, 3]
        }
          , t = '{"a":[1,2,3]}';
        return "undefined" != typeof JSON && "function" == typeof JSON.stringify && JSON.stringify(n).replace(/\s/g, "") === t ? JSON : (Object.toJSON && Object.toJSON(n).replace(/\s/g, "") === t && (e.stringify = Object.toJSON),
        "function" == typeof String.prototype.evalJSON && (n = t.evalJSON()).a && 3 === n.a.length && 3 === n.a[2] && (e.parse = function(e) {
            return e.evalJSON()
        }
        ),
        e.stringify && e.parse ? (H = function() {
            return e
        }
        ,
        e) : null)
    };
    function D(e, n, t) {
        let o;
        for (const a in n)
            n.hasOwnProperty(a) && (a in e ? "object" == typeof (o = n[a]) ? D(e[a], o, t) : t || (e[a] = n[a]) : e[a] = n[a]);
        return e
    }
    function L(e) {
        let t;
        I(r) && function() {
            const e = n.body.appendChild(n.createElement("form"))
              , t = e.appendChild(n.createElement("input"));
            t.name = k + "TEST" + p,
            r = t !== e.elements[t.name],
            n.body.removeChild(e)
        }(),
        r ? t = n.createElement('<iframe name="' + e.props.name + '"/>') : (t = n.createElement("IFRAME")).name = e.props.name,
        t.id = t.name = e.props.name,
        delete e.props.name,
        "string" == typeof e.container && (e.container = n.getElementById(e.container)),
        e.container || (D(t.style, {
            position: "absolute",
            top: "-2000px",
            left: "0px"
        }),
        e.container = n.body);
        const o = e.props.src;
        if (e.props.src = "javascript:false",
        D(t, e.props),
        t.border = t.frameBorder = 0,
        t.allowTransparency = !0,
        e.container.appendChild(t),
        e.onLoad && l(t, "load", e.onLoad),
        e.usePost) {
            let a, i = e.container.appendChild(n.createElement("form"));
            if (i.target = t.name,
            i.action = o,
            i.method = "POST",
            "object" == typeof e.usePost)
                for (const c in e.usePost)
                    e.usePost.hasOwnProperty(c) && (r ? a = n.createElement('<input name="' + c + '"/>') : (a = n.createElement("INPUT")).name = c,
                    a.value = e.usePost[c],
                    i.appendChild(a));
            i.submit(),
            i.parentNode.removeChild(i)
        } else
            t.src = o;
        return e.props.src = o,
        t
    }
    function j(o) {
        let a, i = o.protocol;
        switch (o.isHost = o.isHost || I(F.xdm_p),
        b = o.hash || !1,
        o.props || (o.props = {}),
        o.isHost ? (o.remote = R(o.remote),
        o.channel = o.channel || "default" + p++,
        o.secret = Math.random().toString(16).substring(2),
        I(i) && (i = P(t.href) == P(o.remote) ? "4" : x(e, "postMessage") || x(n, "postMessage") ? "1" : o.swf && x(e, "ActiveXObject") && O() ? "6" : "Gecko" === navigator.product && "frameElement"in e && -1 == navigator.userAgent.indexOf("WebKit") ? "5" : o.remoteHelper ? "2" : "0")) : (o.channel = F.xdm_c.replace(/["'<>\\]/g, ""),
        o.secret = F.xdm_s,
        o.remote = F.xdm_e.replace(/["'<>\\]/g, ""),
        i = F.xdm_p),
        o.protocol = i,
        i) {
        case "0":
            if (D(o, {
                interval: 100,
                delay: 2e3,
                useResize: !0,
                useParent: !1,
                usePolling: !1
            }, !0),
            o.isHost) {
                if (!o.local) {
                    for (var r, s = t.protocol + "//" + t.host, l = n.body.getElementsByTagName("img"), u = l.length; u--; )
                        if ((r = l[u]).src.substring(0, s.length) === s) {
                            o.local = r.src;
                            break
                        }
                    o.local || (o.local = e)
                }
                const d = {
                    xdm_c: o.channel,
                    xdm_p: 0
                };
                o.local === e ? (o.usePolling = !0,
                o.useParent = !0,
                o.local = t.protocol + "//" + t.host + t.pathname + t.search,
                d.xdm_e = o.local,
                d.xdm_pa = 1) : d.xdm_e = R(o.local),
                o.container && (o.useResize = !1,
                d.xdm_po = 1),
                o.remote = q(o.remote, d)
            } else
                D(o, {
                    useParent: !I(F.xdm_pa),
                    usePolling: !I(F.xdm_po),
                    useResize: !o.useParent && o.useResize
                });
            a = [new y.stack.HashTransport(o), new y.stack.ReliableBehavior({}), new y.stack.QueueBehavior({
                encode: !0,
                maxLength: 4e3 - o.remote.length
            }), new y.stack.VerifyBehavior({
                initiate: o.isHost
            })];
            break;
        case "1":
            a = [new y.stack.PostMessageTransport(o)];
            break;
        case "2":
            o.isHost && (o.remoteHelper = R(o.remoteHelper)),
            a = [new y.stack.NameTransport(o), new y.stack.QueueBehavior, new y.stack.VerifyBehavior({
                initiate: o.isHost
            })];
            break;
        case "3":
            a = [new y.stack.NixTransport(o)];
            break;
        case "4":
            a = [new y.stack.SameOriginTransport(o)];
            break;
        case "5":
            a = [new y.stack.FrameElementTransport(o)];
            break;
        case "6":
            c || O(),
            a = [new y.stack.FlashTransport(o)]
        }
        return a.push(new y.stack.QueueBehavior({
            lazy: o.lazy,
            remove: !0
        })),
        a
    }
    function J(e) {
        for (var n, t = {
            incoming: function(e, n) {
                this.up.incoming(e, n)
            },
            outgoing: function(e, n) {
                this.down.outgoing(e, n)
            },
            callback: function(e) {
                this.up.callback(e)
            },
            init: function() {
                this.down.init()
            },
            destroy: function() {
                this.down.destroy()
            }
        }, o = 0, a = e.length; o < a; o++)
            D(n = e[o], t, !0),
            0 !== o && (n.down = e[o - 1]),
            o !== a - 1 && (n.up = e[o + 1]);
        return n
    }
    D(y, {
        version: "2.5.00.0",
        query: F,
        stack: {},
        apply: D,
        getJSONObject: H,
        whenReady: C,
        noConflict: function(n) {
            return e.easyXDM = w,
            (v = n) && (k = "easyXDM_" + v.replace(".", "_") + "_"),
            y
        }
    }),
    y.DomHelper = {
        on: l,
        un: u,
        requiresJSON: function(t) {
            let o;
            "object" == typeof (o = e)["JSON"] && o.JSON || n.write('<script type="text/javascript" src="' + t + '"><\/script>')
        }
    },
    B = {},
    y.Fn = {
        set: function(e, n) {
            B[e] = n
        },
        get: function(e, n) {
            if (B.hasOwnProperty(e)) {
                const t = B[e];
                return n && delete B[e],
                t
            }
        }
    },
    y.Socket = function(e) {
        const n = J(j(e).concat([{
            incoming: function(n, t) {
                e.onMessage(n, t)
            },
            callback: function(n) {
                e.onReady && e.onReady(n)
            }
        }]))
          , t = P(e.remote);
        this.origin = P(e.remote),
        this.destroy = function() {
            n.destroy()
        }
        ,
        this.postMessage = function(e) {
            n.outgoing(e, t)
        }
        ,
        n.init()
    }
    ,
    y.Rpc = function(e, n) {
        if (n.local)
            for (const t in n.local)
                if (n.local.hasOwnProperty(t)) {
                    const o = n.local[t];
                    "function" == typeof o && (n.local[t] = {
                        method: o
                    })
                }
        const a = J(j(e).concat([new y.stack.RpcBehavior(this,n), {
            callback: function(n) {
                e.onReady && e.onReady(n)
            }
        }]));
        this.origin = P(e.remote),
        this.context = e.context || null,
        this.destroy = function() {
            a.destroy()
        }
        ,
        a.init()
    }
    ,
    y.stack.SameOriginTransport = function(e) {
        let n, a, i, r;
        return n = {
            outgoing: function(e, n, t) {
                i(e),
                t && t()
            },
            destroy: function() {
                a && (a.parentNode.removeChild(a),
                a = null)
            },
            onDOMReady: function() {
                r = P(e.remote),
                e.isHost ? (D(e.props, {
                    src: q(e.remote, {
                        xdm_e: t.protocol + "//" + t.host + t.pathname,
                        xdm_c: e.channel,
                        xdm_p: 4
                    }),
                    name: k + e.channel + "_provider"
                }),
                a = L(e),
                y.Fn.set(e.channel, (function(e) {
                    return i = e,
                    o((function() {
                        n.up.callback(!0)
                    }
                    ), 0),
                    function(e) {
                        n.up.incoming(e, r)
                    }
                }
                ))) : (i = function() {
                    let e = parent;
                    if ("" !== v)
                        for (let n = 0, t = v.split("."); n < t.length; n++)
                            e = e[t[n]];
                    return e.easyXDM
                }().Fn.get(e.channel, !0)((function(e) {
                    n.up.incoming(e, r)
                }
                )),
                o((function() {
                    n.up.callback(!0)
                }
                ), 0))
            },
            init: function() {
                C(n.onDOMReady, n)
            }
        }
    }
    ,
    y.stack.FlashTransport = function(e) {
        let a, r, c, l, u;
        function p(e, n) {
            o((function() {
                a.up.incoming(e, c)
            }
            ), 0)
        }
        function f(t) {
            e.swf,
            e.isHost,
            Math.floor(1e4 * Math.random()),
            y.Fn.set("flash_loaded" + t.replace(/[\-.]/g, "_"), (function() {
                y.stack.FlashTransport[t].swf = l = u.firstChild;
                for (var e = y.stack.FlashTransport[t].queue, n = 0; n < e.length; n++)
                    e[n]();
                e.length = 0
            }
            )),
            e.swfContainer ? u = "string" == typeof e.swfContainer ? n.getElementById(e.swfContainer) : e.swfContainer : (D((u = n.createElement("div")).style, s && e.swfNoThrottle ? {
                height: "20px",
                width: "20px",
                position: "fixed",
                right: 0,
                top: 0
            } : {
                height: "1px",
                width: "1px",
                position: "absolute",
                overflow: "hidden",
                right: 0,
                top: 0
            }),
            n.body.appendChild(u)),
            i(t.replace(/[\-.]/g, "_")),
            d.location.protocol,
            i(N(d.location.href)),
            i(function(e) {
                return e.match(h)[4] || ""
            }(d.location.href)),
            i(v)
        }
        return a = {
            outgoing: function(n, t, o) {
                l.postMessage(e.channel, n.toString()),
                o && o()
            },
            destroy: function() {
                try {
                    l.destroyChannel(e.channel)
                } catch (e) {}
                l = null,
                r && (r.parentNode.removeChild(r),
                r = null)
            },
            onDOMReady: function() {
                c = e.remote,
                y.Fn.set("flash_" + e.channel + "_init", (function() {
                    o((function() {
                        a.up.callback(!0)
                    }
                    ))
                }
                )),
                y.Fn.set("flash_" + e.channel + "_onMessage", p),
                e.swf = R(e.swf);
                const n = N(e.swf)
                  , i = function() {
                    y.stack.FlashTransport[n].init = !0,
                    (l = y.stack.FlashTransport[n].swf).createChannel(e.channel, e.secret, P(e.remote), e.isHost),
                    e.isHost && (s && e.swfNoThrottle && D(e.props, {
                        position: "fixed",
                        right: 0,
                        top: 0,
                        height: "20px",
                        width: "20px"
                    }),
                    D(e.props, {
                        src: q(e.remote, {
                            xdm_e: P(t.href),
                            xdm_c: e.channel,
                            xdm_p: 6,
                            xdm_s: e.secret
                        }),
                        name: k + e.channel + "_provider"
                    }),
                    r = L(e))
                };
                y.stack.FlashTransport[n] && y.stack.FlashTransport[n].init ? i() : y.stack.FlashTransport[n] ? y.stack.FlashTransport[n].queue.push(i) : (y.stack.FlashTransport[n] = {
                    queue: [i]
                },
                f(n))
            },
            init: function() {
                C(a.onDOMReady, a)
            }
        }
    }
    ,
    y.stack.PostMessageTransport = function(n) {
        let a, i, r, c;
        function s(e) {
            if ("string" == typeof e.data) {
                const o = function(e) {
                    if (e.origin)
                        return P(e.origin);
                    if (e.uri)
                        return P(e.uri);
                    if (e.domain)
                        return t.protocol + "//" + e.domain;
                    throw "Unable to retrieve the origin of the event"
                }(e);
                o == c && "string" == typeof e.data && e.data.substring(0, n.channel.length + 1) == n.channel + " " && a.up.incoming(e.data.substring(n.channel.length + 1), o)
            }
        }
        function d(t) {
            t.data == n.channel + "-ready" && (r = "postMessage"in i.contentWindow ? i.contentWindow : i.contentWindow.document,
            u(e, "message", d),
            l(e, "message", s),
            o((function() {
                a.up.callback(!0)
            }
            ), 0))
        }
        return a = {
            outgoing: function(e, t, o) {
                r.postMessage(n.channel + " " + e, t || c),
                o && o()
            },
            destroy: function() {
                u(e, "message", d),
                u(e, "message", s),
                i && (r = null,
                i.parentNode.removeChild(i),
                i = null)
            },
            onDOMReady: function() {
                c = P(n.remote),
                n.isHost ? (l(e, "message", d),
                D(n.props, {
                    src: q(n.remote, {
                        xdm_e: P(t.href),
                        xdm_c: n.channel,
                        xdm_p: 1
                    }),
                    name: k + n.channel + "_provider"
                }),
                i = L(n)) : (l(e, "message", s),
                (r = "postMessage"in e.parent ? e.parent : e.parent.document).postMessage(n.channel + "-ready", c),
                o((function() {
                    a.up.callback(!0)
                }
                ), 0))
            },
            init: function() {
                C(a.onDOMReady, a)
            }
        }
    }
    ,
    y.stack.FrameElementTransport = function(a) {
        let i, r, c, s;
        return i = {
            outgoing: function(e, n, t) {
                c.call(this, e),
                t && t()
            },
            destroy: function() {
                r && (r.parentNode.removeChild(r),
                r = null)
            },
            onDOMReady: function() {
                s = P(a.remote),
                a.isHost ? (D(a.props, {
                    src: q(a.remote, {
                        xdm_e: P(t.href),
                        xdm_c: a.channel,
                        xdm_p: 5
                    }),
                    name: k + a.channel + "_provider"
                }),
                (r = L(a)).fn = function(e) {
                    return delete r.fn,
                    c = e,
                    o((function() {
                        i.up.callback(!0)
                    }
                    ), 0),
                    function(e) {
                        i.up.incoming(e, s)
                    }
                }
                ) : (n.referrer && P(n.referrer) != F.xdm_e && (e.top.location = F.xdm_e),
                c = e.frameElement.fn((function(e) {
                    i.up.incoming(e, s)
                }
                )),
                i.up.callback(!0))
            },
            init: function() {
                C(i.onDOMReady, i)
            }
        }
    }
    ,
    y.stack.NameTransport = function(e) {
        let n, t, a, i, r, c, s, l;
        function d(n) {
            const o = e.remoteHelper + (t ? "#_3" : "#_2") + e.channel;
            a.contentWindow.sendMessage(n, o)
        }
        function p() {
            t ? 2 != ++r && t || n.up.callback(!0) : (d("ready"),
            n.up.callback(!0))
        }
        function f(e) {
            n.up.incoming(e, s)
        }
        function h() {
            c && o((function() {
                c(!0)
            }
            ), 0)
        }
        return n = {
            outgoing: function(e, n, t) {
                c = t,
                d(e)
            },
            destroy: function() {
                a.parentNode.removeChild(a),
                a = null,
                t && (i.parentNode.removeChild(i),
                i = null)
            },
            onDOMReady: function() {
                t = e.isHost,
                r = 0,
                s = P(e.remote),
                e.local = R(e.local),
                t ? (y.Fn.set(e.channel, (function(n) {
                    t && "ready" === n && (y.Fn.set(e.channel, f),
                    p())
                }
                )),
                l = q(e.remote, {
                    xdm_e: e.local,
                    xdm_c: e.channel,
                    xdm_p: 2
                }),
                D(e.props, {
                    src: l + "#" + e.channel,
                    name: k + e.channel + "_provider"
                }),
                i = L(e)) : (e.remoteHelper = e.remote,
                y.Fn.set(e.channel, f));
                const n = function() {
                    const t = a || this;
                    u(t, "load", n),
                    y.Fn.set(e.channel + "_load", h),
                    function e() {
                        "function" == typeof t.contentWindow.sendMessage ? p() : o(e, 50)
                    }()
                };
                a = L({
                    props: {
                        src: e.local + "#_4" + e.channel
                    },
                    onLoad: n
                })
            },
            init: function() {
                C(n.onDOMReady, n)
            }
        }
    }
    ,
    y.stack.HashTransport = function(n) {
        let t, a, i, r, c, s, l, u, d;
        function p() {
            if (s) {
                let e = s.location.href
                  , n = ""
                  , o = e.indexOf("#");
                -1 != o && (n = e.substring(o)),
                n && n != c && function(e) {
                    c = e,
                    t.up.incoming(c.substring(c.indexOf("_") + 1), d)
                }(n)
            }
        }
        function f() {
            i = setInterval(p, r)
        }
        return t = {
            outgoing: function(e, t) {
                l && n.remote
            },
            destroy: function() {
                e.clearInterval(i),
                !a && u || l.parentNode.removeChild(l),
                l = null
            },
            onDOMReady: function() {
                if (a = n.isHost,
                r = n.interval,
                c = "#" + n.channel,
                u = n.useParent,
                d = P(n.remote),
                a) {
                    if (D(n.props, {
                        src: n.remote,
                        name: k + n.channel + "_provider"
                    }),
                    u)
                        n.onLoad = function() {
                            s = e,
                            f(),
                            t.up.callback(!0)
                        }
                        ;
                    else {
                        let i = 0
                          , p = n.delay / 50;
                        !function e() {
                            if (++i > p)
                                throw new Error("Unable to reference listenerwindow");
                            try {
                                s = l.contentWindow.frames[k + n.channel + "_consumer"]
                            } catch (e) {}
                            s ? (f(),
                            t.up.callback(!0)) : o(e, 50)
                        }()
                    }
                    l = L(n)
                } else
                    s = e,
                    f(),
                    u ? (l = parent,
                    t.up.callback(!0)) : (D(n, {
                        props: {
                            src: n.remote + "#" + n.channel + new Date,
                            name: k + n.channel + "_consumer"
                        },
                        onLoad: function() {
                            t.up.callback(!0)
                        }
                    }),
                    l = L(n))
            },
            init: function() {
                C(t.onDOMReady, t)
            }
        }
    }
    ,
    y.stack.ReliableBehavior = function(e) {
        let n, t, o = 0, a = 0, i = "";
        return n = {
            incoming: function(e, r) {
                const c = e.indexOf("_")
                  , s = e.substring(0, c).split(",");
                e = e.substring(c + 1),
                s[0] == o && (i = "",
                t && t(!0)),
                e.length > 0 && (n.down.outgoing(s[1] + "," + o + "_" + i, r),
                a != s[1] && (a = s[1],
                n.up.incoming(e, r)))
            },
            outgoing: function(e, r, c) {
                i = e,
                t = c,
                n.down.outgoing(a + "," + ++o + "_" + e, r)
            }
        }
    }
    ,
    y.stack.QueueBehavior = function(e) {
        let n, t, r = [], c = !0, s = "", l = 0, u = !1, d = !1;
        function p() {
            if (e.remove && 0 === r.length)
                return (a = n).up.down = a.down,
                a.down.up = a.up,
                void (a.up = a.down = null);
            let a;
            if (!c && 0 !== r.length && !t) {
                c = !0;
                const i = r.shift();
                n.down.outgoing(i.data, i.origin, (function(e) {
                    c = !1,
                    i.callback && o((function() {
                        i.callback(e)
                    }
                    ), 0),
                    p()
                }
                ))
            }
        }
        return n = {
            init: function() {
                I(e) && (e = {}),
                e.maxLength && (l = e.maxLength,
                d = !0),
                e.lazy ? u = !0 : n.down.init()
            },
            callback: function(e) {
                c = !1;
                const t = n.up;
                p(),
                t.callback(e)
            },
            incoming: function(t, o) {
                if (d) {
                    const i = t.indexOf("_")
                      , r = parseInt(t.substring(0, i), 10);
                    s += t.substring(i + 1),
                    0 === r && (e.encode && (s = a(s)),
                    n.up.incoming(s, o),
                    s = "")
                } else
                    n.up.incoming(t, o)
            },
            outgoing: function(t, o, a) {
                e.encode && (t = i(t));
                let c, s = [];
                if (d) {
                    for (; 0 !== t.length; )
                        c = t.substring(0, l),
                        t = t.substring(c.length),
                        s.push(c);
                    for (; c = s.shift(); )
                        r.push({
                            data: s.length + "_" + c,
                            origin: o,
                            callback: 0 === s.length ? a : null
                        })
                } else
                    r.push({
                        data: t,
                        origin: o,
                        callback: a
                    });
                u ? n.down.init() : p()
            },
            destroy: function() {
                t = !0,
                n.down.destroy()
            }
        }
    }
    ,
    y.stack.VerifyBehavior = function(e) {
        let n, t, o;
        function a() {
            t = Math.random().toString(16).substring(2),
            n.down.outgoing(t)
        }
        return n = {
            incoming: function(i, r) {
                const c = i.indexOf("_");
                -1 === c ? i === t ? n.up.callback(!0) : o || (o = i,
                e.initiate || a(),
                n.down.outgoing(i)) : i.substring(0, c) === o && n.up.incoming(i.substring(c + 1), r)
            },
            outgoing: function(e, o, a) {
                n.down.outgoing(t + "_" + e, o, a)
            },
            callback: function(n) {
                e.initiate && a()
            }
        }
    }
    ,
    y.stack.RpcBehavior = function(e, n) {
        let t, o = n.serializer || H(), a = 0, i = {};
        function r(e) {
            e.jsonrpc = "2.0",
            t.down.outgoing(o.stringify(e))
        }
        function c(e, n) {
            const t = Array.prototype.slice;
            return function() {
                let o, c = arguments.length, s = {
                    method: n
                };
                c > 0 && "function" == typeof arguments[c - 1] ? (c > 1 && "function" == typeof arguments[c - 2] ? (o = {
                    success: arguments[c - 2],
                    error: arguments[c - 1]
                },
                s.params = t.call(arguments, 0, c - 2)) : (o = {
                    success: arguments[c - 1]
                },
                s.params = t.call(arguments, 0, c - 1)),
                i["" + ++a] = o,
                s.id = a) : s.params = t.call(arguments, 0),
                e.namedParams && 1 === s.params.length && (s.params = s.params[0]),
                r(s)
            }
        }
        function s(n, t, o, a) {
            if (o) {
                let i, c, s;
                t ? (i = function(e) {
                    i = f,
                    r({
                        id: t,
                        result: e
                    })
                }
                ,
                c = function(e, n) {
                    c = f;
                    const o = {
                        id: t,
                        error: {
                            code: -32099,
                            message: e
                        }
                    };
                    n && (o.error.data = n),
                    r(o)
                }
                ) : i = c = f,
                s = a,
                "[object Array]" !== Object.prototype.toString.call(s) && (a = [a]);
                try {
                    const l = e.context || o.scope
                      , u = o.method.apply(l, a.concat([i, c]));
                    I(u) || i(u)
                } catch (e) {
                    c(e.message)
                }
            } else
                t && r({
                    id: t,
                    error: {
                        code: -32601,
                        message: "Procedure not found."
                    }
                })
        }
        return t = {
            incoming: function(e, t) {
                const a = o.parse(e);
                if (a.method)
                    n.handle ? n.handle(a, r) : s(a.method, a.id, n.local[a.method], a.params);
                else {
                    const c = i[a.id];
                    a.error ? c.error && c.error(a.error) : c.success && c.success(a.result),
                    delete i[a.id]
                }
            },
            init: function() {
                if (n.remote)
                    for (const o in n.remote)
                        n.remote.hasOwnProperty(o) && (e[o] = c(n.remote[o], o));
                t.down.init()
            },
            destroy: function() {
                for (const o in n.remote)
                    n.remote.hasOwnProperty(o) && e.hasOwnProperty(o) && delete e[o];
                t.down.destroy()
            }
        }
    }
    ,
    d.easyXDM = y
}(window, document, location, window.setTimeout, decodeURIComponent, encodeURIComponent),
function() {
    const e = window.intakeq
      , n = document.getElementById("intakeq");
    if (n) {
        const t = window.intakeqHost || "intakeq.com";
        n.style.position = "relative";
        const o = document.createElement("span");
        o.innerHTML = "Loading...",
        o.style.color = "#888",
        o.style.fontSize = "15px",
        o.style.display = "block",
        o.style.position = "absolute",
        o.style.top = "100px",
        o.style.width = "100%",
        o.style.textAlign = "center",
        n.appendChild(o);
        var a, i, r = function(e, n) {
            let t = null;
            try {
                t = new CustomEvent(e,{
                    detail: n
                })
            } catch (o) {
                (t = document.createEvent("Event")).initEvent(e, !0, !0),
                t.detail = n
            }
            document.dispatchEvent(t)
        }, c = new easyXDM.Socket({
            remote: window.widgetUrl || "https://" + t + "/bookingwidget/" + e,
            container: n,
            props: {
                style: {
                    width: "100%",
                    height: "300px"
                }
            },
            firstLoad: !0,
            onReady: function() {
                n.removeChild(o),
                c.postMessage(JSON.stringify({
                    message: "init",
                    locationId: window.intakeqLocationId,
                    host: window.location.href,
                    serviceId: window.intakeqServiceId,
                    packageId: window.intakeqPackageId,
                    categoryId: window.intakeqCategoryId,
                    practitionerId: window.intakeqPractitionerId,
                    groupId: window.intakeqGroupId,
                    portalId: window.portalId,
                    clientArea: window.intakeqClientArea,
                    clientName: window.intakeqClientName,
                    clientEmail: window.intakeqClientEmail,
                    clientPhone: window.intakeqClientPhone,
                    clientDob: window.intakeqClientDob,
                    reminderType: window.intakeqReminderType,
                    packagesOnly: window.intakeqPackagesOnly,
                    servicesOnly: window.intakeqServicesOnly,
                    utmSource: window.intakeqUtmSource,
                    utmMedium: window.intakeqUtmMedium,
                    utmCampaign: window.intakeqUtmCampaign
                })),
                this.container.getElementsByTagName("iframe")[0].style.height = "400px",
                this.container.getElementsByTagName("iframe")[0].style.width = "100%",
                this.container.getElementsByTagName("iframe")[0].title = "Booking Widget";
                try {
                    r("intakeqWidgetLoaded", {})
                } catch (e) {}
            },
            onMessage: function(e, t) {
                if ("redirect" == (a = JSON.parse(e)).message && (window.location.href = a.url),
                "appointmentBooked" == a.message)
                    r("intakeqAppointmentBooked", a.appointment);
                else if ("packageSignUp" == a.message)
                    r("intakeqPackageSignUp", a.package);
                else if ("resize" == a.message) {
                    0 == a.h && (a.h = 700),
                    this.container.getElementsByTagName("iframe")[0].style.height = a.h + "px";
                    try {
                        this.container.getElementsByTagName("iframe")[0].style.setProperty("height", a.h + "px", "important")
                    } catch (e) {}
                    if (!this.firstLoad && n && n.getBoundingClientRect().top < 0) {
                        for (var o = n.offsetTop, a = n; a = a.offsetParent; )
                            o += a.offsetTop;
                        window.scrollTo(0, o)
                    }
                    this.firstLoad = !1
                }
            }
        });
        a = window.location.hostname,
        i = t,
        -1 !== a.indexOf(i, a.length - i.length) && (window.intakeqs = c)
    }
}();
