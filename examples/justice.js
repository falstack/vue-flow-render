/* eslint-disable */
"use strict";
!function () {
  var a = ".justice{position:fixed;bottom:0;left:0;right:0;background:black;padding:0 10px 10px 10px;box-sizing:border-box;font-size:12px;font-family:monospace;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;z-index:2147483647;-webkit-transition:400ms ease-in-out;transition:400ms ease-in-out;direction:ltr}@media (min-width: 1235px){.justice{padding-bottom:10px;}}.justice.closed{-webkit-transform:translateY(100%);-ms-transform:translateY(100%);transform:translateY(100%)}#justice-text-metrics{display:none}.justice .justice-metric-wrap{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:wrap;-ms-flex-flow:wrap;flex-flow:wrap;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.justice .justice-metric{height:40px;display:inline-block;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin:10px 10px 0 0}.justice .justice-metric.chart{width:300px}.justice .justice-title{text-transform:uppercase;padding:3px 0.5em 3px 3px;color:#dfdfdf}.justice .justice-text{color:#dfdfdf;font-weight:600}.justice .justice-text.pass{color:#419ba3}.justice .justice-text.warn{color:#d4ca3d}.justice .justice-text.fail{color:#ce452d}.justice .justice-toggle{width:20px;height:20px;cursor:pointer;background-color:black;position:absolute;right:0;top:-20px;opacity:0.5;border-top-left-radius:50%;-webkit-transition:400ms ease-in-out;transition:400ms ease-in-out}@media only screen and (min-device-pixel-ratio: 1.1){.justice .justice-toggle{width:40px;height:40px;top:-40px;}}.justice .justice-toggle:after{content:'';position:absolute;width:50%;height:50%;border-radius:100%;margin:5px;background-color:#dfdfdf;-webkit-transition:400ms ease-in-out;transition:400ms ease-in-out}@media only screen and (min-device-pixel-ratio: 1.1){.justice .justice-toggle:after{margin:10px;}}.justice.closed .justice-toggle{opacity:1}.justice.closed .justice-toggle:after{background-color:#419ba3}",
    b = document.createElement("style");
  if (document.getElementsByTagName("head")[0].appendChild(b), b.styleSheet) b.styleSheet.disabled || (b.styleSheet.cssText = a); else try {
    b.innerHTML = a
  } catch (c) {
    b.innerText = a
  }
}();
var Justice = function () {
  function a(a) {
    var b = {}, a = a || {};
    for (var c in W) b[c] = W[c];
    for (var c in a) b[c] = a[c];
    return b
  }

  function b(a, b, c) {
    for (var d in a.metrics) b[d] = c[d]
  }

  function c() {
    return O.loadEventStart - O.navigationStart
  }

  function d() {
    return O.domComplete - O.domLoading
  }

  function e() {
    return O.domInteractive - O.domLoading
  }

  function f() {
    var a = 0;
    return window.chrome && window.chrome.loadTimes ? (a = 1e3 * window.chrome.loadTimes().firstPaintTime, a -= 1e3 * window.chrome.loadTimes().startLoadTime, a.toFixed(0)) : "number" == typeof window.performance.timing.msFirstPaint ? (a = window.performance.timing.msFirstPaint, a -= window.performance.timing.navigationStart, a.toFixed(0)) : "¯\\_(ツ)_/¯"
  }

  function g() {
    return performance.getEntries ? performance.getEntries().length : "¯\\_(ツ)_/¯"
  }

  function h() {
    return O.responseStart - O.connectEnd
  }

  function i(a) {
    if (T) {
      var b = (a - T) / 1e3, c = 1 / b, d = c > 60 ? 60 : Math.floor(c);
      R = d, S.push([d, d]), S.length > L && S.shift(), T = a
    } else T = a
  }

  function j(a, b) {
    var c = "";
    return c = a > b ? "fail" : a > b * X.warnThreshold ? "warn" : "pass"
  }

  function k(a, b, c) {
    var d = b.collector(), e = j(d, c);
    return ['<div class="' + G + '-metric" id="' + b.id + '">', '<span class="' + G + '-title">' + b.label + ": </span>", '<span class="' + G + "-text " + e + '">' + d + b.unitLabel + "</span>", "</div>"].join("")
  }

  function l(a) {
    var b = [];
    for (var c in Z) {
      var d = k(c, Z[c], X.metrics[c].budget);
      b.push(d)
    }
    return '<div id="' + G + '-text-metrics" class="' + G + '-metric-wrap">' + b.join("") + "</div>"
  }

  function m() {
    var a = X.showFPS ? ['<div class="' + G + '-metric chart">', '<span class="' + G + '-title">FPS: </span>', '<canvas id="' + G + '-fps" class="' + G + '-canvas" height="' + I + '" width="' + H + '"></canvas>', "</div>"].join("") : "";
    return a
  }

  function n(a, b) {
    a.clearRect(0, 0, b.width, b.height), q(a), o(a), p(a)
  }

  function o(a) {
    var b = 10;
    a.font = "600 " + b + "px sans-serif", a.fillStyle = D, a.fillText(0, 0, I), a.fillStyle = E, a.fillText(30, 0, I / 2 + b / 2), a.fillStyle = F, a.fillText(60, 0, 0 + b)
  }

  function p(a) {
    var b = a.createLinearGradient(0, I, 0, 0);
    b.addColorStop(0, D), b.addColorStop(.25, D), b.addColorStop(.5, E), b.addColorStop(1, F), a.strokeStyle = b, a.fillStyle = b
  }

  function q(a) {
    for (var b = 0; 3 > b; b++) {
      var c = I / 2 * b + .5 - (2 === b ? 1 : 0);
      a.beginPath(), a.moveTo(.5 + K, c), a.lineTo(H + .5, c), a.lineWidth = 1, a.strokeStyle = C, a.stroke()
    }
  }

  function r(a) {
    var b = null;
    return "spline" === a ? b = t : "dots" === a && (b = s), b
  }

  function s(a, b, c) {
    n(a, b);
    for (var d = 0; d < c.length; d++) {
      var e = (60 - c[d][1]) * J;
      a.fillRect(c.length - d + K, e, 1.5, 1.5)
    }
  }

  function t(a, b, c) {
    n(a, b), a.beginPath();
    var d = c.length > 0 ? c[c.length] : 0;
    a.moveTo(0, d);
    for (var e = 0; e < c.length; e++) {
      var f = 0 === e ? 0 : e, g = (60 - c[e][1]) * J;
      a.lineTo(c.length - f + K, g)
    }
    a.lineWidth = 1, a.stroke()
  }

  function u() {
    U = document.getElementById(G + "-fps"), V = U.getContext("2d")
  }

  function v() {
    var a = z();
    P = document.createElement("div"), P.id = G, P.classList.add(G), P.classList.add(a), document.body.appendChild(P), P = document.getElementById(G), P.innerHTML = ['<div id="' + G + '-toggle" class="' + G + '-toggle"></div>', l(), m()].join(""), X.showFPS && u(), x()
  }

  function w() {
    var a = l(Z), b = document.getElementById(G + "-text-metrics");
    b.innerHTML = a
  }

  function x() {
    document.getElementById(G + "-toggle").onclick = function () {
      var a = document.getElementById(G);
      a.className.match(" closed") ? (a.className = a.className.replace(" closed", ""), y("open")) : (a.className += " closed", y("closed"))
    }
  }

  function y(a) {
    window.localStorage && window.localStorage.setItem(G + "-state", a)
  }

  function z() {
    return window.localStorage ? window.localStorage.getItem(G + "-state") || "open" : void 0
  }

  function A(a) {
    N++, X.showFPS && (i(a), Q(V, U, S)), null === M ? M = a : a - M > 3e3 && (M = a, w()), window.requestAnimationFrame(A)
  }

  function B(c) {
    O = window.performance.timing, X = a(c), b(X, Z, Y), v(), Q = r(X.chartType), window.requestAnimationFrame(A)
  }

  var C = "rgb(48, 48, 48)", D = "rgb(206, 69, 45)", E = "rgb(212, 202, 61)", F = "rgb(65, 155, 163)", G = "justice",
    H = 300, I = 40, J = I / 60, K = 20, L = H - K, M = 0, N = 0, O = null, P = null, Q = null, R = 0, S = [], T = null,
    U = null, V = null, W = {
      metrics: {
        TTFB: {budget: 200},
        domInteractive: {budget: 250},
        domComplete: {budget: 800},
        firstPaint: {budget: 1e3},
        pageLoad: {budget: 2e3},
        requests: {budget: 6}
      }, "interface": {position: "fixed", placement: "bottom"}, warnThreshold: .8, chartType: "spline", showFPS: !0
    }, X = {}, Y = {
      pageLoad: {id: G + "-load", label: "Load", unitLabel: "ms", collector: c},
      firstPaint: {id: G + "-paint", label: "Paint", unitLabel: "ms", collector: f},
      TTFB: {id: G + "-ttfb", label: "TTFB", unitLabel: "ms", collector: h},
      domComplete: {id: G + "-complete", label: "Complete", unitLabel: "ms", collector: d},
      domInteractive: {id: G + "-interactive", label: "Interactive", unitLabel: "ms", collector: e},
      requests: {id: G + "-requests", label: "Requests", unitLabel: "", collector: g}
    }, Z = {};
  return {
    init: function (a) {
      "performance" in window && "timing" in window.performance ? "complete" === document.readyState ? B(a, "already loaded") : window.onload = function () {
        B(a)
      } : console.log("Justice: performance api not supported in this browser, initialization stopped.")
    }
  }
}();

window.Justice = Justice
