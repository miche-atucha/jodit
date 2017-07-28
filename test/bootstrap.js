Jodit.defaultOptions.observer.timeout = 0;
console.log(screen.width);
var expect = chai.expect;
var stuff = [];
var removeStuff = function () {
    stuff.forEach(function (elm) {
        elm && elm.parentNode && elm.parentNode.removeChild(elm);
        delete elm;
    })
    stuff.length = 0;
};
var box = document.createElement('div');
document.body.appendChild(box);
var getBox = function () {
    return box;
}
var appendTestArea = function (id, noput) {
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id', id || ('editor_' + (new Date()).getTime()));
    box.appendChild(textarea);
    !noput && stuff.push(textarea);
    return textarea;
}

var sortAtrtibutes = function (html) {
    var tag = /<([^>]+)>/g;
    var reg = /([a-z_\-]+)[\s]*=[\s]*"([^"]*)"/i, matches, tags = [];

    while (tagmatch = tag.exec(html)) {
        attrs = [];

        var newtag = tagmatch[0];

        do {
            matches = reg.exec(newtag);
            if (!matches) {
                break;
            }

            if (matches[1].toLowerCase() === 'style') {
                var styles = matches[2].split(';');
                styles = styles.map(function (elm) {
                    return elm.replace(/^[\s\r\t\n]+/g, '').replace(/[\s\r\t\n]+$/g, '')
                }).filter(function (elm) {
                    return elm.length;
                }).sort(function (a, b) {
                    return  (a < b) ? -1 : (a > b) ? 1 : 0;
                });
                matches[2] = styles.join(';')
            }

            if (matches[1].toLowerCase() !== 'unselectable') {
                attrs.push({
                    name: matches[1].toLowerCase(),
                    value: matches[2],
                });

                newtag = newtag.replace(matches[0], 'attribute:'  + attrs.length);
            } else {
                newtag = newtag.replace(' ' + matches[0], '');
            }

        } while(matches);

        attrs.sort(function (a, b) {
            return  (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        })

        attrs.forEach(function (elm, i) {
            newtag = newtag.replace('attribute:'  + (i + 1), elm.name + '="' + elm.value + '"');
        });

        tags.push({
            name: tagmatch[0],
            value: newtag,
        });
    }

    tags.forEach(function (elm, i) {
        html = html.replace(elm.name, elm.value);
    });

    return html;
}

/**
 *
 * @param type
 * @param keyCodeArg
 * @param element
 * @param options
 */
var simulateEvent = function (type, keyCodeArg, element, options) {
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent(type, true, true);
    evt.keyCode = keyCodeArg;
    evt.which = keyCodeArg;
    if (options) {
        options(evt);
    }
    element.dispatchEvent(evt);
}

var setCursor = function (elm, inEnd) {
    var range = document.createRange();
    range.selectNodeContents(elm);
    range.collapse(!inEnd);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}