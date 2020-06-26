/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/22/17
 * Time: 3:20 PM
 * File:
 */
angular
  .module("ba.docs.core")
  .service("CoreTracking", function($log, CoreFullstory, CoreIntercom) {
    function __parseIdentity(user) {
      var identity = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        isAppOwner: user.isOwner(),
        isAppAdmin: user.isAdmin(),
        isApprovedByDoug: user.isApprovedByDoug,
        isRejectedByDoug: user.isRejectedByDoug
      };

      return identity;
    }

    this.identify = function(user) {
      var identity = __parseIdentity(user);
      CoreIntercom.identify(identity);
      CoreFullstory.identify(identity);
    };

    this.update = function(extension) {
      CoreIntercom.update(extension);
    };

    this.trackEvent = function(eventName, eventData) {
      CoreIntercom.trackEvent(eventName, eventData);
      $log.debug("Event Tracked", eventName, eventData);
    };
  })
  // [Start: Intercom]
  .service("CoreIntercom", function($intercom, $timeout) {
    this.identify = function(identity) {
      $intercom.boot(identity);
    };

    this.update = function(extension) {
      $intercom.update(extension);
    };

    this.trackEvent = function(eventName, params) {
      $intercom.trackEvent(eventName, params);
      $timeout(function() {
        $intercom.update();
      }, 500);
    };
  })
  // [STOP: Intercom]
  // [START: Fullstory]
  .provider("$fullstory", function() {
    this.$get = function() {
      if (!this.hasSrc) {
        window["_fs_debug"] = false;
        window["_fs_host"] = "www.fullstory.com";
        window["_fs_org"] = "JQ6V0";
        window["_fs_namespace"] = "FS";

        (function(m, n, e, t, l, o, g, y) {
          if (e in m && m.console && m.console.log) {
            m.console.log(
              'FullStory namespace conflict. Please set window["_fs_namespace"].'
            );
            return;
          }
          g = m[e] = function(a, b) {
            g.q ? g.q.push([a, b]) : g._api(a, b);
          };
          g.q = [];
          o = n.createElement(t);
          o.async = 1;
          o.src = "https://" + _fs_host + "/s/fs.js";
          y = n.getElementsByTagName(t)[0];
          y.parentNode.insertBefore(o, y);
          g.identify = function(i, v) {
            g(l, {
              uid: i
            });
            if (v) g(l, v);
          };
          g.setUserVars = function(v) {
            g(l, v);
          };
          g.identifyAccount = function(i, v) {
            o = "account";
            v = v || {};
            v.acctId = i;
            g(o, v);
          };
          g.clearUserCookie = function(c, d, i) {
            if (!c || document.cookie.match("fs_uid=[^;`]*`[^;`]*`[^;`]*`")) {
              d = n.domain;
              while (1) {
                n.cookie =
                  "fs_uid=;domain=" + d + ";path=/;expires=" + new Date(0);
                i = d.indexOf(".");
                if (i < 0) break;
                d = d.slice(i + 1);
              }
            }
          };
        })(window, document, window["_fs_namespace"], "script", "user");

        this.hasSrc = true;
      }

      return window.FS;
    };
  })
  .service("CoreFullstory", function($injector, Environment) {
    var $fullstory = null;

    this.identify = function(identity) {
      // TODO make only prod soon
      // if (Environment.name == 'prod' || Environment.name == 'dev') {
      $fullstory = $injector.get("$fullstory");

      $fullstory.identify(identity.email, {
        displayName: identity.firstName + " " + identity.lastName
      });
      // }
    };
  });
// [STOP: Fullstory]
