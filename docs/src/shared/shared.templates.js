angular.module('ba.shared').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/shared/directives/actions-menu/shared.directives.actions-mask.html',
    "<div class=ba-dropdown-mask></div>"
  );


  $templateCache.put('/src/shared/directives/actions-menu/shared.directives.actions-menu.html',
    "<ul class=\"ba-dropdown-menu ba-dropdown-menu--sm ba-dropdown-menu--contextmenu\" style=\"width: 150px; display: block\"><li class=ba-dropdown-item ng-class=dropdownItem.class ng-repeat=\"dropdownItem in actionsList\" ng-disabled=\"dropdownItem.isDisabled(actionsItem, $event)\" ng-click=\"action(dropdownItem, actionsItem, $event)\"><div ba-flexbox=\"row y-center\" ba-px=1.5><div class=\"ba-dropdown-item__icon ba-svg-xs\" ba-svg={{::dropdownItem.icon}} ba-mr=1.5></div><div class=ba-dropdown-item__label ba-text=\"p small normal\" ba-c-text=2>{{::(dropdownItem.getTitle(actionsItem) || dropdownItem.title)}}</div></div></li></ul>"
  );


  $templateCache.put('/src/shared/directives/datepicker/shared.directives.datepicker.container.html',
    "<div ng-switch=datepickerMode role=application ng-keydown=keydown($event)><daypicker ng-switch-when=day tabindex=0></daypicker><monthpicker ng-switch-when=month tabindex=0></monthpicker><yearpicker ng-switch-when=year tabindex=0></yearpicker></div>"
  );


  $templateCache.put('/src/shared/directives/datepicker/shared.directives.datepicker.day.html',
    "<table role=grid style=outline:0 aria-labelledby={{::uniqueId}}-title aria-activedescendant={{activeDateId}} ba-col=12><thead><tr class=ba-datepicker-header ba-mb=2><th><button type=button class=\"ba-btn-n-mono ba-svg-btn ba-btn--xs ba-btn--block\" ng-click=move(-1) tabindex=-1 ba-svg=arrow-left-1 ba-c-svg=mono-dark></button></th><th colspan=\"{{::5 + showWeeks}}\" ba-text=\"h5 small-caps center\"><strong ba-text=\"\">{{title}}</strong></th><th><button type=button class=\"ba-btn-n-mono ba-svg-btn ba-btn--xs ba-btn--block\" ng-click=move(1) tabindex=-1 ba-svg=arrow-right-1 ba-c-svg=mono-dark></button></th></tr><tr><th ng-if=showWeeks class=text-center></th><th ng-repeat=\"label in ::labels track by $index\" ba-pt=1 ba-pb=1 class=text-center><small aria-label={{::label.full}} ba-text=\"h6 small-caps semi-bold\" ba-c-text=mono-dark>{{::label.abbr}}</small></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-if=showWeeks class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td><td align=center ng-repeat=\"dt in row track by dt.date\" class=\"text-center ba-datepicker-date\" role=gridcell id={{::dt.uid}} ng-class=::dt.customClass><button type=button class=\"ba-btn-n-mono-dark ba-btn--xs ba-datepicker-btn--day\" ng-class=\"{'ba-btn--active': dt.selected, 'ba-datepicker-date--current': dt.current, 'ba-datepicker-date--secondary': dt.secondary && !dt.disabled}\" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{::dt.label}}</button></td></tr></tbody></table>"
  );


  $templateCache.put('/src/shared/directives/datepicker/shared.directives.datepicker.month.html',
    "<table role=grid style=outline:0 aria-labelledby={{::uniqueId}}-title aria-activedescendant={{activeDateId}} ba-col=12><thead><tr class=ba-datepicker-header ba-mb=2><th><button type=button class=\"ba-btn-n-mono ba-btn--xs ba-btn--block\" ng-click=move(-1) tabindex=-1 ba-svg=arrow-left-1 ba-c-svg=mono-dark></button></th><th><button id={{::uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button class=\"ba-btn-n-mono ba-btn--xs\" ng-click=toggleMode() ng-disabled=\"datepickerMode === maxMode\" tabindex=-1 style=width:100%><strong>{{title}}</strong></button></th><th><button type=button class=\"ba-btn-n-mono ba-btn--xs ba-btn--block\" ng-click=move(1) tabindex=-1 ba-svg=arrow-right-1 ba-c-svg=mono-dark></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-repeat=\"dt in row track by dt.date\" class=ba-datepicker-month role=gridcell id={{::dt.uid}} ng-class=::dt.customClass><button type=button style=min-width:100% class=\"ba-btn-n-mono ba-btn--xs ba-datepicker-btn--month\" ng-class=\"{'ba-btn--active': dt.selected, 'ba-text-accent': isActive(dt)}\" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1><span ba-text=\"{{dt.current && 'bold'}}\" ba-c-text=\"{{dt.secondary && !dt.disabled ? 3 : ''}}\">{{::dt.label.substring(0, 3)}}</span></button></td></tr></tbody></table>"
  );


  $templateCache.put('/src/shared/directives/datepicker/shared.directives.datepicker.popup.html',
    "<ul class=ba-dropdown-menu ba-pxy=1 ng-if=isOpen style=\"display: block; max-height: 400px\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" ng-keydown=keydown($event) ng-click=$event.stopPropagation()><li ng-transclude></li><li ng-if=showButtonBar ba-pxy=2><span class=\"btn-group pull-left\"><button type=button class=\"ba-btn-o-mono ba-btn--xs\" ng-click=\"select('today')\">{{ getText('current') }}</button> <button type=button class=\"ba-btn-o-mono ba-btn--xs\" ng-click=select(null)>{{ getText('clear') }}</button></span> <button type=button class=\"ba-btn-primary ba-btn--xs\" ba-pull=right ng-click=close()>{{ getText('close') }}</button></li></ul>"
  );


  $templateCache.put('/src/shared/directives/datepicker/shared.directives.datepicker.year.html',
    "<table role=grid style=outline:0 aria-labelledby={{::uniqueId}}-title aria-activedescendant={{activeDateId}} ba-col=12><thead><tr><th><button type=button class=\"ba-btn-n-mono ba-btn--xs ba-btn--block\" ng-click=move(-1) tabindex=-1 ba-svg=arrow-left-1></button></th><th colspan=3><button id={{::uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button class=\"ba-btn-n-mono ba-btn--xs\" ng-click=toggleMode() ng-disabled=\"datepickerMode === maxMode\" tabindex=-1 style=width:100%><strong>{{title}}</strong></button></th><th><button type=button class=\"ba-btn-n-mono ba-btn--xs ba-btn--block\" ng-click=move(1) tabindex=-1 ba-svg=arrow-right-1></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-repeat=\"dt in row track by dt.date\" class=ba-datepicker-year role=gridcell id={{::dt.uid}}><button type=button style=min-width:100% class=\"ba-btn-n-mono ba-btn--xs ba-datepicker-btn--year\" ng-class=\"{'ba-btn--active': dt.selected, 'ba-text-accent': isActive(dt)}\" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1><span ba-text=\"{{dt.current && 'bold'}}\" ba-c-text=\"{{dt.secondary && !dt.disabled ? 3 : ''}}\">{{::dt.label.substring(0, 3)}}</span></button></td></tr></tbody></table>"
  );


  $templateCache.put('/src/shared/directives/growler/shared.directives.growler.html',
    "<div class=ba-growler ba-pxy=2><div class=\"ba-growl ba-growl--{{growl.type}} jsa-growl\" ng-click=growl.action() ng-repeat=\"growl in growls\"><div class=ba-growl__icon ng-if=::growl.icon ba-pl=3 ba-pr=1><div ba-svg={{::growl.icon}} class=ba-svg-sm></div></div><div class=ba-growl__body ba-px=2 ba-py=3><span ba-text=\"p flat\">{{growl.text}}</span></div><div class=ba-growl__close ng-click=\"remove(growl, $event)\" ba-px=4 ba-c-text=i3 ba-text=extra-bold>X</div></div></div>"
  );


  $templateCache.put('/src/shared/directives/modal/shared.directives.modal-backdrop.html',
    "<div class=\"ba-modal-backdrop fade {{ backdropClass }}\" ng-click=close() ng-class=\"{in: animate}\" ng-style=\"{'z-index': 9000 + (index && 1 || 0) + index*10}\"></div>"
  );


  $templateCache.put('/src/shared/directives/modal/shared.directives.modal-window.html',
    "<div tabindex=-1 role=dialog class=\"ba-modal valign-contain fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 9010 + index*10, display: 'block'}\"><div class=ba-modal-dialog ng-class=\"{'ba-modal--sm': size == 'sm', 'ba-modal--md': size == 'md', 'ba-modal--lg': size == 'lg', 'ba-modal--xl': size == 'xl', 'ba-modal--full': size == 'full'}\"><div class=ba-modal-content modal-transclude></div></div></div>"
  );


  $templateCache.put('/src/shared/directives/popdown/shared.directives.popdown-mask.html',
    "<div class=ba-popdown-mask></div>"
  );


  $templateCache.put('/src/shared/directives/popdown/shared.directives.popdown-popover.html',
    "<div class=ba-popdown-popover></div>"
  );


  $templateCache.put('/src/shared/directives/slider/shared.directives.slider.html',
    "<span class=bar></span> <span class=\"bar selection\"></span> <span class=pointer></span> <span class=pointer></span> <span class=\"bubble limit\"></span> <span class=\"bubble limit\"></span> <span class=bubble></span> <span class=bubble></span> <span class=bubble></span>"
  );


  $templateCache.put('/src/shared/directives/timepicker/shared.directives.timepicker.html',
    "<table><tbody><tr class=text-center ng-show=::showSpinners><td ba-text=center><div ng-click=incrementHours() class=ba-svg-btn ba-mb=1><div ba-svg=arrow-up-1 class=ba-svg-sm></div></div></td><td>&nbsp;</td><td ba-text=center><div ng-click=incrementMinutes() class=ba-svg-btn ba-mb=1><div ba-svg=arrow-up-1 class=ba-svg-sm></div></div></td><td ng-show=showMeridian></td></tr><tr><td class=form-group ng-class=\"{'has-error': invalidHours}\"><input class=\"ba-input-sm ba-timepicker-input\" ng-model=hours ng-change=updateHours() class=\"form-control text-center\" ng-readonly=::readonlyInput maxlength=2></td><td ba-px=2 ba-text=\"h6 semi-bold\" ba-c-text=mono>:</td><td class=form-group ng-class=\"{'has-error': invalidMinutes}\"><input class=\"ba-input-sm ba-timepicker-input\" ng-model=minutes ng-change=updateMinutes() class=\"form-control text-center\" ng-readonly=::readonlyInput maxlength=2></td><td class=ba-timepicker-meridian-btn ng-show=showMeridian><button type=button ba-ml=2 class=\"ba-btn-o-mono ba-btn--rounded ba-btn--sm\" ng-click=toggleMeridian()>{{meridian}}</button></td></tr><tr class=text-center ng-show=::showSpinners><td ba-text=center><div ng-click=decrementHours() class=ba-svg-btn ba-mt=1.5><div ba-svg=arrow-down-1 class=ba-svg-sm></div></div></td><td>&nbsp;</td><td ba-text=center><div ng-click=decrementMinutes() class=ba-svg-btn ba-mt=1.5><div ba-svg=arrow-down-1 class=ba-svg-sm></div></div></td><td ng-show=showMeridian></td></tr></tbody></table>"
  );


  $templateCache.put('/src/shared/directives/tooltip/shared.directives.tooltip-html-popup.html',
    "<div class=ba-tooltip tooltip-animation-class=fade tooltip-classes ng-class=\"{ in: isOpen() }\"><div class=ba-tooltip-arrow></div><div class=ba-tooltip-inner ng-bind-html=contentExp()></div></div>"
  );


  $templateCache.put('/src/shared/directives/tooltip/shared.directives.tooltip-popup.html',
    "<div class=ba-tooltip tooltip-classes ng-class=\"{ in: isOpen() }\"><div class=ba-tooltip-arrow></div><div class=ba-tooltip-inner ng-bind=content ba-text=x-small></div></div>"
  );


  $templateCache.put('/src/shared/directives/tooltip/shared.directives.tooltip-template-popup.html',
    "<span class=ba-tooltip tooltip-animation-class=fade tooltip-classes ng-class=\"{ in: isOpen() }\"><div class=ba-tooltip-arrow></div><div class=ba-tooltip-inner tooltip-template-transclude=contentExp() tooltip-template-transclude-scope=originScope()></div></span>"
  );


  $templateCache.put('/src/shared/directives/typeahead/shared.directives.typeahead-match.html',
    "<a tabindex=-1 ng-bind-html=\"match.label | typeaheadHighlight:query\"></a>"
  );


  $templateCache.put('/src/shared/directives/typeahead/shared.directives.typeahead-popup.html',
    "<ul class=\"ba-typeahead-menu ba-typeahead-menu--sm ba-typeahead-menu--block\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" style=\"display: block\" role=listbox aria-hidden={{!isOpen()}}><li class=ba-typeahead-item ng-repeat=\"match in matches track by $index\" ng-class=\"{'ba-typeahead-item--active': isActive($index) }\" ng-mouseenter=selectActive($index) ng-click=selectMatch($index) role=option id={{::match.id}}><div ba-typeahead-match index=$index match=match query=query template-url=templateUrl></div><div ba-text=\"p x-small\" ba-c-text=2>{{match.address.name}}</div>hey</li></ul>"
  );

}]);
