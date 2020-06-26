// 0 = trial, 1 = day-hike, 2 = thru-hike, 3 = section-hike, 4 = summit
angular
  .module("ba.docs.core")
  .service("CoreBillingFeatures", function() {
    // day hike
    this.dayHike = [
      {
        key: "messagePushNotification",
        tier: 1,
        name: "Push notifications",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageGeofence",
        tier: 1,
        name: "Geofenced messages",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "appCoreSdk",
        tier: 1,
        name: "Core SDK",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageAnalytics",
        tier: 1,
        name: "Message analytics",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "placeAnalytics",
        tier: 1,
        name: "Place analytics",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "placeGeolocation",
        tier: 1,
        name: "Geolocation",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageGoal",
        tier: 1,
        name: "Store visit tracking",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageSocialSharing",
        tier: 1,
        name: "Social Sharing",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageSchedule",
        tier: 1,
        name: "Scheduled messages",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageRichMedia",
        tier: 1,
        name: "Rich media",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "appKnowledgeAndHelp", // ditto other comment
        tier: 1,
        name: "Help documentation",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "placeSortingAndCategorizing", // i know.. but in the future i bet they will want to break this out into seperate features, and this will make it easier cus the prop is isolated
        tier: 1,
        name: "Categorize places",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        key: "messageInAppEngagement",
        tier: 1,
        name: "In-app engagement",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      }
    ];
    // Section hike (enterprise)
    this.sectionHike = _.concat(this.dayHike, []);
    // Thru hike (enterprise)
    this.thruHike = _.concat(this.sectionHike, [
      {
        key: "appChatSupport",
        tier: 3,
        name: "Live chat support",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        // last-2 index
        key: "messagePullNotification",
        tier: 3,
        name: "Additional data",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      }
    ]);
    // Summit hike (enterprise)
    this.summitHikeFeatures = _.concat(this.thruHike, [
      {
        key: "appMobileAPI",
        tier: 4,
        name: "Mobile API Access",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      },
      {
        // last index
        key: "appWhiteLabel",
        tier: 4,
        name: "White label license",
        helpUrl: "https://help.boardactive.com/tutorials/what-is-boardactive"
      }
    ]);

    this.all = _.concat(this.summitHikeFeatures, []);
  });
