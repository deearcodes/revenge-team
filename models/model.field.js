/**
 * @singleton
 */
var field = {

    height: 480,
    width: 672, // 480 * 1.4
    marginH: 20,
    marginV: 20,

    el: null,

    init: function () {
        this.el = $("#c")[0];

        // field size
        $(this.el).attr({
            width: field.marginH + field.width + field.marginH,
            height: field.marginV + field.height + field.marginV
        });
    },

    getElementByCoords: function (x, y) {
        var cap, i, max;
        for (i = 0, max = caps.length; i < max; i++) {
            cap = caps[i];
            if (cap.x > x - cap.radio && cap.x < x + cap.radio) {
                if (cap.y > y - cap.radio && cap.y < y + cap.radio) {
                    return cap;
                }
            }
        }
        return null;
    },

    /**
     * @return {Boolean} True iif there is no another cap on that area
     */
    canPutCapOnCoords: function (cap, x, y) {
        var i, max;
        for (i = 0, max = caps.length; i < max; i++) {
            icap = caps[i];
            if (cap !== icap) {
                if (getEuclideanDistance(x, y, icap.x, icap.y) < cap.radio * 2) {
                    return false;
                }
            }
        }
        return true;
    }
};
