
function GenericCap() {
    this.radio = 12,
    this.getMoveRange = function () {
        return this.speed * 4;
    };
    this.getPassRange = function () {
        return this.pass * 20;
    };
    this.getPassAngleError = function () {
        /*
         * We add 2 to cap.talent to avoid concave angles for
         * very low cap.talent values. Also, adding at least 1 is
         * needed to avoid division by zero.
         */
        return 0.1 * 20 / (2 + this.talent);
    }
    this.isCapOverTheBall = function () {
        return getEuclideanDistance(this.x, this.y, ball.x, ball.y) <= this.radio;
    };
    this.hasBall = function () {
        return ball.poss === this;
    };
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        if (this.hasBall()) {
            ball.setPosition(x, y);
        }
    };
}

function Cap(id, team) {
    this.id = id;
    this.x = field.marginH + Math.random() * field.width;
    this.y = field.marginV + Math.random() * field.height;
    this.speed = 60; // on steroids just for debugging purposes
    this.talent = 5;
    this.pass = 15;
    this.team = team;
}
Cap.prototype = new GenericCap();

var capPreview = {
    x: 0,
    y: 0
};
