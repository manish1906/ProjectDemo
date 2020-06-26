angular.module('ba.docs.core')
    .filter('secondsToDateTime', function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(Math.floor(seconds));
        };
    })
    .filter('shortEndDate', function ($filter) {
        return function (endDate) {
            var label;
            var now = new Date();
            var stopDate = new Date(endDate);
            var secondsElapsed = parseInt((now.getTime() - stopDate.getTime()) / 1000, 10),
                daysElapsed = parseInt(secondsElapsed / 86400, 10),
                hoursElapsed = parseInt(secondsElapsed / 3600, 10),
                minutesElapsed = parseInt(secondsElapsed / 60);

            // if greater than 1 day
            if (daysElapsed > 0) {
                label = 'Ends in' + Math.max(daysElapsed, 0) + ' day' + (daysElapsed == 1 ? '' : 's');
            } else if (hoursElapsed > 0) { // if greater than 1 hour
                label = 'Ends in' + Math.max(hoursElapsed, 0) + ' hour' + (hoursElapsed == 1 ? '' : 's');
            } else if (minutesElapsed) {
                label = 'Ends in' + Math.max(minutesElapsed, 0) + ' minute' + (minutesElapsed == 1 ? '' : 's');
            } else {
                label = 'Ends in' + Math.max(secondsElapsed, 0) + ' second' + (secondsElapsed == 1 ? '' : 's');
            }

            return label;
        }
    })
    /*
     stopwatch

     ceiling max is 24 hrs
     */
    .filter('stopwatch', function ($log) {
        return function (seconds, ceiling, length) {

            seconds = parseInt(seconds);
            ceiling = parseInt(ceiling) || 3600;
            var isLong = length === 'long';
            var label = isLong ? '00:00:00' : '00:00';
            var tSeconds = seconds;

            if (!isLong && ceiling > 86400) {
                ceiling = 86400;
                $log.error('[stopwatch] short ceiling cannot be greater than 24 hrs.');
            }

            function _parseLabel(value) {
                if (!value) {
                    return '00'
                } else {
                    if (value < 10) {
                        return '0' + value;
                    } else {
                        return '' + value;
                    }
                }
            }

            var hrs = Math.floor(tSeconds / 3600);
            tSeconds -= hrs * 3600;
            var mins = Math.floor(tSeconds / 60);
            tSeconds -= mins * 60;
            var secs = tSeconds;

            var tCeiling = ceiling;
            var cHrsLabel = _parseLabel(Math.floor(tCeiling / 3600));
            tCeiling -= cHrsLabel * 3600;
            var cMinsLabel = _parseLabel(Math.floor(tCeiling / 60));
            tCeiling -= cMinsLabel * 60;
            var cSecsLabel = _parseLabel(tCeiling);

            var hrsLabel = _parseLabel(hrs),
                minsLabel = _parseLabel(mins),
                secsLabel = _parseLabel(secs);

            if (seconds < ceiling) {
                label = (isLong ? hrsLabel + ':' : '') + minsLabel + ':' + secsLabel;
            } else {
                label = '>' + (isLong ? cHrsLabel + ':' : '') + (isLong ? cMinsLabel : '60') + ':' + cSecsLabel;
            }

            return label;
        }
    })
    .filter('prettyShortDate', function ($filter) {
        return function (date) {
            var d = new Date(date);
            var isThisYear = d.getFullYear() == (new Date().getFullYear());
            var dateFormatter = isThisYear ? 'M/d' : 'M/d/yy';
            return $filter('date')(d, dateFormatter);
        };
    })
    .filter('percentage', function ($filter) {
        return function (input, decimals) {
            if (input === 1) {
                return 100 + '%';
            } else {
                return $filter('number')(input * 100, decimals) + '%';
            }
        };
    })
    .filter('roundedPercent', function ($filter) {
        return function (input) {
            if (input === 1) {
                return 100 + '%';
            } else if (input && input <= .01 && input > 0) {
                return '<1%';
            } else {
                return $filter('number')(input * 100, 0) + '%';
            }
        };
    })
    .filter('ellipsis', function () {
        return function (input, limit, position) {
            var length = input ? input.length : 0;

            if (length > limit) {
                var str = '';

                if (position && position === 'end') {
                    str = input.substr(0, limit) + "...";
                } else {
                    var firstHalf = parseInt(limit / 2),
                        secondHalf = length - firstHalf;

                    str = input.substr(0, firstHalf) + " .. " + input.substr(secondHalf, length);
                }

                return str;
            } else {
                return input;
            }
        };
    })
    .filter('capitalize', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }) : '';
        }
    })
    .filter('capitalizeFirstChar', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1);
                }) : '';
        }
    })
    .filter('bytes', function () {
        return function (bytes, precision) {
            if (bytes === 0) return '0 bytes';
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;

            var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));

            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
    })
    .filter('medNum', function () {
        return function (num) {
            if (isNaN(parseFloat(num)) || !isFinite(num)) return '-';
            var shortNum = num.toString();
            var absNum = Math.abs(num);

            if (absNum >= 1000 && absNum < 10000) {
                shortNum = shortNum.substr(0, 1) + ',' + shortNum.substr(1);
            } else if (absNum >= 10000 && absNum < 1000000) {
                shortNum = shortNum.slice(0, shortNum.length - 3) + 'K';
            } else if (absNum >= 1000000) {
                shortNum = shortNum.slice(0, shortNum.length - 6) + 'M';
            }
            return shortNum;
        }
    })
    .filter('shortNum', function () {
        return function (num) {
            if (isNaN(parseFloat(num)) || !isFinite(num)) return '-';
            var shortNum = num.toString();
            var absNum = Math.abs(num);

            if (absNum >= 1000 && absNum < 10000) {
                shortNum = (num / 1000).toFixed(1) + 'K';
            } else if (absNum >= 10000 && absNum < 1000000) {
                shortNum = shortNum.slice(0, shortNum.length - 3) + 'K';
            } else if (absNum >= 1000000) {
                shortNum = shortNum.slice(0, shortNum.length - 6) + 'M';
            }
            return shortNum;
        }
    })
    .filter("toArray", function () {
        return function (obj) {
            var result = [];
            angular.forEach(obj, function (val, key) {
                result.push(val);
            });
            return result;
        };
    })
    .filter('secondsToDateTime', [function () {
        return function (seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }])
    .filter('secondsToDateTimeMilliseconds', [function () {
        return function (seconds) {
            return new Date(0).setMilliseconds(seconds * 1000);
        };
    }]);
