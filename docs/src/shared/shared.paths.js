angular.module("ba.shared").service("SharedPaths", function() {
  var mainPath = "/src/shared/";
  var svgsPath = mainPath + "assets/svg/shared.";
  var iconsPath = svgsPath + "icons.";
  var streamlineIconsPath = mainPath + "assets/svg/";
  var directivesPath = mainPath + "directives/";

  this.svg = {
    "onboarding-backpack-equipment":
      streamlineIconsPath + "onboarding-backpack-equipment.svg",
    // app onboarding icons (not streamline i believe)
    "app-onboarding-hiking-male-caucasian":
      streamlineIconsPath + "app-onboarding-hiking-male-caucasian.svg",
    "app-onboarding-map-location-1":
      streamlineIconsPath + "app-onboarding-map-location-1.svg",
    "app-onboarding-map-location-computer":
      streamlineIconsPath + "app-onboarding-map-location-computer.svg",
    "app-onboarding-volcano":
      streamlineIconsPath + "app-onboarding-volcano.svg",
    // streamline icons
    add: streamlineIconsPath + "add.svg",
    "add-square": streamlineIconsPath + "add-square.svg",
    "alert-triangle": streamlineIconsPath + "alert-triangle.svg",
    android: streamlineIconsPath + "android.svg",
    "arrow-down-1": streamlineIconsPath + "arrow-down-1.svg",
    "arrow-left-1": streamlineIconsPath + "arrow-left-1.svg",
    "arrow-right-1": streamlineIconsPath + "arrow-right-1.svg",
    "arduino-plus-minus": streamlineIconsPath + "arduino-plus-minus.svg",
    "arrow-up-1": streamlineIconsPath + "arrow-up-1.svg",
    "award-medal-1": streamlineIconsPath + "award-medal-1.svg",
    bin: streamlineIconsPath + "bin.svg",
    calendar: streamlineIconsPath + "calendar.svg",
    "calendar-check": streamlineIconsPath + "calendar-check.svg",
    "calendar-disable": streamlineIconsPath + "calendar-disable.svg",
    "camping-tent-3": streamlineIconsPath + "camping-tent-3.svg",
    "camping-tent-map": streamlineIconsPath + "camping-tent-map.svg",
    "check-circle-1": streamlineIconsPath + "check-circle-1.svg",
    close: streamlineIconsPath + "close.svg",
    cog: streamlineIconsPath + "cog.svg",
    "cog-double-2": streamlineIconsPath + "cog-double-2.svg",
    "compass-1": streamlineIconsPath + "compass-1.svg",
    "conversation-chat": streamlineIconsPath + "conversation-chat.svg",
    "email-action-unread": streamlineIconsPath + "email-action-unread.svg",
    "expand-vertical": streamlineIconsPath + "expand-vertical.svg",
    "information-desk-question-help":
      streamlineIconsPath + "information-desk-question-help.svg",
    "generic-phone": streamlineIconsPath + "generic-phone.svg",
    "keyboard-arrow-down": streamlineIconsPath + "keyboard-arrow-down.svg",
    "keyboard-arrow-up": streamlineIconsPath + "keyboard-arrow-up.svg",
    "landmark-volcano": streamlineIconsPath + "landmark-volcano.svg",
    "location-user": streamlineIconsPath + "location-user.svg",
    "logout-1": streamlineIconsPath + "logout-1.svg",
    "love-heart-hands-hold": streamlineIconsPath + "love-heart-hands-hold.svg",
    "outdoors-flame-lantern":
      streamlineIconsPath + "outdoors-flame-lantern.svg",
    megaphone: streamlineIconsPath + "megaphone.svg",
    "messages-bubble-square-smile":
      streamlineIconsPath + "messages-bubble-square-smile.svg",
    "messages-bubble-square":
      streamlineIconsPath + "messages-bubble-square.svg",
    "navigation-menu": streamlineIconsPath + "navigation-menu.svg",
    "navigation-menu-horizontal":
      streamlineIconsPath + "navigation-menu-horizontal.svg",
    "notes-list": streamlineIconsPath + "notes-list.svg",
    pin: streamlineIconsPath + "pin.svg",
    paragraph: streamlineIconsPath + "paragraph.svg",
    "pencil-write-2": streamlineIconsPath + "pencil-write-2.svg",
    "pin-location-1": streamlineIconsPath + "pin-location-1.svg",
    "pin-location-2": streamlineIconsPath + "pin-location-2.svg",
    "professional-network-linkedin":
      streamlineIconsPath + "professional-network-linkedin.svg",
    ruler: streamlineIconsPath + "ruler.svg",
    "presentation-analytics":
      streamlineIconsPath + "presentation-analytics.svg",
    "school-bag": streamlineIconsPath + "school-bag.svg",
    "question-circle": streamlineIconsPath + "question-circle.svg",
    "road-sign-warning": streamlineIconsPath + "road-sign-warning.svg",
    "send-email-2": streamlineIconsPath + "send-email-2.svg",
    "sign-badge-circle": streamlineIconsPath + "sign-badge-circle.svg",
    "single-neutral-phone-book":
      streamlineIconsPath + "single-neutral-phone-book.svg",
    "style-one-pin-star": streamlineIconsPath + "style-one-pin-star.svg",
    "style-one-pin-target": streamlineIconsPath + "style-one-pin-target.svg",
    "sync-location": streamlineIconsPath + "sync-location.svg",
    "social-media-facebook": streamlineIconsPath + "social-media-facebook.svg",
    "social-media-facebook-1": streamlineIconsPath + "social-media-facebook-1.svg",
    "social-media-twitter": streamlineIconsPath + "social-media-twitter.svg",
    "time-clock-circle": streamlineIconsPath + "time-clock-circle.svg",
    "touch-finger-1": streamlineIconsPath + "touch-finger-1.svg",
    "user-network": streamlineIconsPath + "user-network.svg",
    "location-user": streamlineIconsPath + "location-user.svg",
    "office-chair": streamlineIconsPath + "office-chair.svg",
    phone: streamlineIconsPath + "phone.svg",
    "os-system-apple": streamlineIconsPath + "os-system-apple.svg",
    "chair-1": streamlineIconsPath + "chair-1.svg",
    // Misc + BA specific
    "google-icon": iconsPath + "google-icon.svg",
    "icon-boardactive-sm": iconsPath + "boardactive-sm.svg",
    "icon-boardactive-fixed": iconsPath + "boardactive-fixed.svg"
  };

  this.datepicker = {
    container:
      directivesPath + "datepicker/shared.directives.datepicker.container.html",
    popup:
      directivesPath + "datepicker/shared.directives.datepicker.popup.html",
    day: directivesPath + "datepicker/shared.directives.datepicker.day.html",
    month:
      directivesPath + "datepicker/shared.directives.datepicker.month.html",
    year: directivesPath + "datepicker/shared.directives.datepicker.year.html"
  };

  this.actionsMenu = {
    actionsMenu:
      directivesPath + "actions-menu/shared.directives.actions-menu.html",
    actionsMask:
      directivesPath + "actions-menu/shared.directives.actions-mask.html"
  };

  this.growler = directivesPath + "growler/shared.directives.growler.html";
  this.slider = directivesPath + "slider/shared.directives.slider.html";
  this.timepicker =
    directivesPath + "timepicker/shared.directives.timepicker.html";

  this.tooltip = {
    htmlPopup:
      directivesPath + "tooltip/shared.directives.tooltip-html-popup.html",
    templatePopup:
      directivesPath + "tooltip/shared.directives.tooltip-template-popup.html",
    popup: directivesPath + "tooltip/shared.directives.tooltip-popup.html"
  };

  this.typeahead = {
    match: directivesPath + "typeahead/shared.directives.typeahead-match.html",
    popup: directivesPath + "typeahead/shared.directives.typeahead-popup.html"
  };

  this.popDown = {
    mask: directivesPath + "popdown/shared.directives.popdown-mask.html",
    popover: directivesPath + "popdown/shared.directives.popdown-popover.html"
  };

  this.modal = {
    backdrop: directivesPath + "modal/shared.directives.modal-backdrop.html",
    window: directivesPath + "modal/shared.directives.modal-window.html"
  };
});
