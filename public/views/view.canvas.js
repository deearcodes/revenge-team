/**
 * Acts as output channel
 *
 * Reads
 *  Vars from the graphic controller (as view configuration)
 *  Vars from the model (as state)
 *
 * @see http://en.wikipedia.org/wiki/Circle#Terminology
 */

var canvas = {

    el: null,

    init: function () {
        this.el = $("#canvas")[0];
        ctx = this.el.getContext('2d');
        $(this.el).attr({
            width: field.marginH + field.width + field.marginH,
            height: field.marginV + field.height + field.marginV
        });
    },

    redraw: function () {
        "use strict";

        function drawTriangle(p1, p2, p3, fillStyle) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
        };

        function drawSector(x, y, radio, startAngle, endAngle, fillStyle) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radio, startAngle - Math.PI / 2, endAngle - Math.PI / 2, false);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
        };

        function drawCircle(x, y, radio, fillStyle) {
            ctx.beginPath();
            ctx.arc(x, y, radio, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
        };



        var i, // iterator (auxiliar)
            max, // loop limit (auxiliar)
            a, // angle pass preview vs cap
            aerr, // pass angle error
            p1, p2, p3; // points of a triangle (auxiliar)

        // field
        ctx.beginPath();
        ctx.rect(
            0,
            0,
            field.marginH + field.width + field.marginH,
            field.marginV + field.height + field.marginV
        );
        ctx.fillStyle = '#009000';
        ctx.fill();

        // cap move range radio
        if (gc.ongoing.what === "start move" || gc.ongoing.what === "moving") {
            drawCircle(
                gc.ongoing.who.x,
                gc.ongoing.who.y,
                gc.ongoing.who.getMoveRange(), '#40C040'
            );
        }

        // pass preview
        if (gc.ongoing.what === "start pass" || gc.ongoing.what === "passing") {
            a = app.pass.getAngle(gc.ballPreview.x, gc.ballPreview.y);
            aerr = gc.ongoing.who.getPassAngleError(); // angle error

            // Red cone. Actually a triangle wider than the field.
            p1 = {x: gc.ongoing.who.x, y: gc.ongoing.who.y};
            p2 = utils.getPointAt(p1, field.width * 2, a - aerr);
            p3 = utils.getPointAt(p1, field.width * 2, a + aerr);
            drawTriangle(p1, p2, p3, '#F06060');

            // Green cone. Actually a circle sector.
            drawSector(
                gc.ongoing.who.x,
                gc.ongoing.who.y,
                app.pass.getGreenZoneRadio(a, aerr),
                a - aerr,
                a + aerr,
                '#60F060'
            );

            // rival caps defense preview
            for (i = 0, max = app.caps.length; i < max; i++) {
                if (app.caps[i].team !== gc.ongoing.who.team) {
                    drawCircle(
                        app.caps[i].x,
                        app.caps[i].y,
                        app.caps[i].getDefenseRange(),
                        this.capDefenseColors[app.caps[i].team]
                    );
                }
            }

        } // fi pass preview

        // caps
        for (i = 0, max = app.caps.length; i < max; i++) {
            drawCircle(
                app.caps[i].x,
                app.caps[i].y,
                app.caps[i].radio,
                this.capColors[app.caps[i].team]
            );
        }

        // cap move preview
        if (gc.ongoing.what === "start move" || gc.ongoing.what === "moving") {
            drawCircle(
                gc.capPreview.x,
                gc.capPreview.y,
                gc.ongoing.who.radio,
                this.capPreviewColors[gc.ongoing.who.team]
            );
        }

        // ball
        drawCircle(app.ball.x, app.ball.y, app.ball.radio, '#F0F0F0');

        // Ball preview
        if (gc.ongoing.what === "start pass" || gc.ongoing.what === "passing") {
            drawCircle(
                gc.ballPreview.x,
                gc.ballPreview.y,
                app.ball.radio,
                '#FFFFFF'
            );
        }

    } // redraw

};

canvas.capColors = [];
canvas.capColors[Team.LOCAL] = '#0000A0';
canvas.capColors[Team.VISITOR] = '#A00000';

canvas.capPreviewColors = [];
canvas.capPreviewColors[Team.LOCAL] = '#0000F0';
canvas.capPreviewColors[Team.VISITOR] = '#F00000';

canvas.capDefenseColors = [];
canvas.capDefenseColors[Team.LOCAL] = '#A0A0FF';
canvas.capDefenseColors[Team.VISITOR] = '#FFA0A0';

var ctx;