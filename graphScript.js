var canvas;
var context;
var countries = [];
var max = 9;//number of countries
var r = 290; //radius of circle
var cx = 400; //center x
var cy = 350; //center y
var can; //raphael canvas
var l; //length of each piece
var div; //division between sections
var thisYear = 1993;
var START = 1993;
var END = 2013;
var theta;
var off = 4;
var isExp = true;
var imp = 5;
var iX1;
var iY1;
var iX2;
var iY2;
var colors = [];
var op = 0.8;
var thick = 10;
var selected = null;
var slide;
var total;
var c;
var isDown=false;
var time = 50;
var isPlay;

function init() {
    isPlay = false;
    var myVar = setInterval(function() {
       play();
    }, time);
    c = 0;
    canvas = $('#canvas')[0];
    context = canvas.getContext("2d");
    r = canvas.height / 2.5;
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    can = new Raphael(8, 8, canvas.width, canvas.height);
    slide = document.getElementById('slider');
    slide.addEventListener('mousedown', function() {
        isDown = true;
        draw();
    });
        slide.addEventListener('mousemove', function() {
        if(isDown){
            thisYear = slide.value;
            draw();
        }
    });
        slide.addEventListener('mouseup', function() {
        if(isDown){
            thisYear = slide.value;
            isDown=false;
            draw();
        }
    });

    for (j = 0; j < max; j++) {
        country = new Country("Countries/" + j + ".json")
        countries.push(country);
    }

    for (g = 0; g < countries.length; g++) {
        colors.push(randomColor());
    }
    theta = (360 - (off * (countries.length + 1)) - imp);
    div = (Math.PI * off) / 180;
    impD = (Math.PI * imp) / 180;
    l = (2 * Math.PI - (div * (countries.length + 1)) - impD);
}

function play(){
    if(isPlay && slide.value<END){
        slide.value++;
        draw();
   }
   else
    isPlay=false;
}

function draw() {
    thisYear = slide.value;
    context.clearRect(0, 0, canvas.width, canvas.height);
    can.clear();
    total = 0;
    for (h = 0; h < countries.length; h++) {
        if (isExp)
            total += countries[h].exports[thisYear - START].total.total;
        else
            total += countries[h].imports[thisYear - START].total.total;
    }
    impD = Math.PI * imp / 180;
    start = div + impD;
    for (i = 0; i < countries.length; i++) {
        if (isExp)
            thisAmount = countries[i].exports[thisYear - START].total.total;
        else
            thisAmount = countries[i].imports[thisYear - START].total.total;
        d = thisAmount / total;
        length = d * l;
        d = d * theta; //how much we have in this piece
        ang = (start * 180) / Math.PI; //angle to start
        countries[i].drawOutside(start, start + length);
        countries[i].setPos(ang, d);
        start += length;
        start += div;
    }
    d = Math.PI * imp / 180;
    drawOutside(start, start + d);
    iX1 = cx + (r * Math.cos(d));
    iY1 = cy - (r * Math.sin(d));
    iX2 = cx + r;
    iY2 = cy;
    for (k = 0; k < countries.length; k++) {
        countries[k].drawData(colors[k]);
    }
    w = 180;
    h = 80;
    myX = 10;
    myY = canvas.height - myX - h;
    var box = can.rect(myX, myY, w, h);
    box.attr("fill", "#C8C8C8");
    can.text(myX + (w * 0.5), myY + (h * 0.5), thisYear).attr({
        "font-size": 50,
        "font-family": "Arial, Helvetica, sans-serif"
    });

    size = 40;

   var playB = can.path([
                'M', myX+canvas.width/1.2, myY,
                'L', myX+canvas.width/1.2+size,myY+size/2,
                'L', myX+canvas.width/1.2, myY+size,
                'Z'
            ]);
    playB.attr({"stroke-width": 3, fill: "red"});

    can.text(myX+20+canvas.width/1.2,myY+size+15, "Play").attr({
        "font-size": 25,
        "font-family": "Arial, Helvetica, sans-serif"
    });
    playB.click(function(){
            isPlay=true;
            });

}

function drawOutside(start, end) {
    mid = start + ((end - start) / 1.8);
    newX = cx + ((r + 20) * Math.cos(mid));
    newY = cy - ((r + 20) * Math.sin(mid));
    angle = mid * 180 / Math.PI;
    angle -= 90;
    startX = cx + ((r) * Math.cos(start));
    startY = cy - ((r) * Math.sin(start));
    endX = cx + ((r) * Math.cos(end));
    endY = cy - ((r) * Math.sin(end));
    var side = can.path([
        'M', startX, startY,
        'A', r, r, 0, 0, 0, endX, endY,
    ]);
    side.attr({
        "stroke-width": 10
    });
    var t = can.text(newX, newY, "Other");
    t.rotate(-angle);
    t.attr({
        "font-family": "Comic Sans MS"
    });
}

Country.prototype.drawOutside = function(start, end) {
    mid = start + ((end - start) / 1.6);
    newX = cx + ((r + 20) * Math.cos(mid));
    newY = cy - ((r + 20) * Math.sin(mid));
    angle = mid * 180 / Math.PI;
    angle -= 90;
    startX = cx + ((r) * Math.cos(start));
    startY = cy - ((r) * Math.sin(start));
    endX = cx + ((r) * Math.cos(end));
    endY = cy - ((r) * Math.sin(end));
    var side = can.path([
        'M', startX, startY,
        'A', r, r, 0, 0, 0, endX, endY,
    ]);
    side.attr({
        "stroke-width": 10
    });
    var t = can.text(newX, newY, this.name);
    t.rotate(-angle);
    t.attr({
        "font-size": 12
    });
    t.attr({
        "font-family": "Comic Sans MS"
    });
    t.click(function() {
        thisCountry = getCountry(t.attrs.text);
        if (thisCountry == selected)
            selected = null;
        else
            selected = getCountry(t.attrs.text);
        update();
    });
}

Country.prototype.drawData = function(color) {
    if (isExp) {
        to = getCountry(this.exports[thisYear - START].a['country']);
        if (to != null) {
            var p1 = can.path([
                'M', this.x1, this.y1,
                'A', r, r, 0, 0, 0, this.x2, this.y2,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x1, this.y1
            ]);
        } else {
            var p1 = can.path([
                'M', this.x1, this.y1,
                'A', r, r, 0, 0, 0, this.x2, this.y2,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x1, this.y1
            ]);
        }
        to = getCountry(this.exports[thisYear - START].b['country']);
        if (to != null) {
            var p2 = can.path([
                'M', this.x2, this.y2,
                'A', r, r, 0, 0, 0, this.x3, this.y3,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x2, this.y2
            ]);
        } else {
            var p2 = can.path([
                'M', this.x2, this.y2,
                'A', r, r, 0, 0, 0, this.x3, this.y3,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x2, this.y2
            ]);
        }
        to = getCountry(this.exports[thisYear - START].c['country']);
        if (to != null) {
            var p3 = can.path([
                'M', this.x3, this.y3,
                'A', r, r, 0, 0, 0, this.x4, this.y4,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x3, this.y3
            ]);
        } else {
            var p3 = can.path([
                'M', this.x3, this.y3,
                'A', r, r, 0, 0, 0, this.x4, this.y4,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x3, this.y3
            ]);
        }
        to = getCountry(this.exports[thisYear - START].d['country']);
        if (to != null) {
            var p4 = can.path([
                'M', this.x4, this.y4,
                'A', r, r, 0, 0, 0, this.x5, this.y5,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x4, this.y4
            ]);
        } else {
            var p4 = can.path([
                'M', this.x4, this.y4,
                'A', r, r, 0, 0, 0, this.x5, this.y5,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x4, this.y4
            ]);
        }
        to = getCountry(this.exports[thisYear - START].e['country']);
        if (to != null) {
            var p5 = can.path([
                'M', this.x5, this.y5,
                'A', r, r, 0, 0, 0, this.x6, this.y6,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x5, this.y5
            ]);
        } else {
            var p5 = can.path([
                'M', this.x5, this.y5,
                'A', r, r, 0, 0, 0, this.x6, this.y6,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x5, this.y5
            ]);
        }
        var p6 = can.path([
            'M', this.x6, this.y6,
            'A', r, r, 0, 0, 0, this.x7, this.y7,
            'Q', cx, cy, iX2, iY2,
            'A', r, r, 0, 0, 0, iX1, iY1,
            'Q', cx, cy, this.x6, this.y6
        ]);
    } else {
        to = getCountry(this.imports[thisYear - START].a['country']);
        if (to != null) {
            var p1 = can.path([
                'M', this.x1, this.y1,
                'A', r, r, 0, 0, 0, this.x2, this.y2,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x1, this.y1
            ]);
        } else {
            var p1 = can.path([
                'M', this.x1, this.y1,
                'A', r, r, 0, 0, 0, this.x2, this.y2,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x1, this.y1
            ]);
        }
        to = getCountry(this.imports[thisYear - START].b['country']);
        if (to != null) {
            var p2 = can.path([
                'M', this.x2, this.y2,
                'A', r, r, 0, 0, 0, this.x3, this.y3,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x2, this.y2
            ]);
        } else {
            var p2 = can.path([
                'M', this.x2, this.y2,
                'A', r, r, 0, 0, 0, this.x3, this.y3,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x2, this.y2
            ]);

        }
        to = getCountry(this.imports[thisYear - START].c['country']);
        if (to != null) {
            var p3 = can.path([
                'M', this.x3, this.y3,
                'A', r, r, 0, 0, 0, this.x4, this.y4,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x3, this.y3
            ]);
        } else {
            var p3 = can.path([
                'M', this.x3, this.y3,
                'A', r, r, 0, 0, 0, this.x4, this.y4,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x3, this.y3
            ]);
        }
        to = getCountry(this.imports[thisYear - START].d['country']);
        if (to != null) {
            var p4 = can.path([
                'M', this.x4, this.y4,
                'A', r, r, 0, 0, 0, this.x5, this.y5,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x4, this.y4
            ]);
        } else {
            var p4 = can.path([
                'M', this.x4, this.y4,
                'A', r, r, 0, 0, 0, this.x5, this.y5,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x4, this.y4
            ]);

        }
        to = getCountry(this.imports[thisYear - START].e['country']);
        if (to != null) {
            var p5 = can.path([
                'M', this.x5, this.y5,
                'A', r, r, 0, 0, 0, this.x6, this.y6,
                'Q', cx, cy, to.x0, to.y0,
                'A', r, r, 0, 0, 0, to.x1, to.y1,
                'Q', cx, cy, this.x5, this.y5
            ]);
        } else {
            var p5 = can.path([
                'M', this.x5, this.y5,
                'A', r, r, 0, 0, 0, this.x6, this.y6,
                'Q', cx, cy, iX2, iY2,
                'A', r, r, 0, 0, 0, iX1, iY1,
                'Q', cx, cy, this.x5, this.y5
            ]);
        }
        var p6 = can.path([
            'M', this.x6, this.y6,
            'A', r, r, 0, 0, 0, this.x7, this.y7,
            'Q', cx, cy, iX2, iY2,
            'A', r, r, 0, 0, 0, iX1, iY1,
            'Q', cx, cy, this.x6, this.y6
        ]);
    }
    p1.attr({
        fill: color,
        "opacity": op
    });
    p2.attr({
        fill: color,
        "opacity": op
    });
    p3.attr({
        fill: color,
        "opacity": op
    });
    p4.attr({
        fill: color,
        "opacity": op
    });
    p5.attr({
        fill: color,
        "opacity": op
    });
    p6.attr({
        fill: color,
        "opacity": op
    });
    this.arcs.push(p1);
    this.arcs.push(p2);
    this.arcs.push(p3);
    this.arcs.push(p4);
    this.arcs.push(p5);
    this.arcs.push(p6);
}

Country.prototype.setOp = function(opacity) {
    for (y = 0; y < this.arcs.length; y++) {
        this.arcs[y].attr({
            "opacity": opacity
        });
    }
}

function update() {
    for (p = 0; p < countries.length; p++) {
        if (selected != null) {
            if (selected == countries[p]) {
                countries[p].setOp(1);
            } else {
                countries[p].setOp(0.15);
            }
        } else
            countries[p].setOp(op);
    }
}

function getCountry(countryName) {
    for (i = 0; i < countries.length; i++) {
        if (countries[i].name == countryName)
            return countries[i];
    }
    return null;
}

Country.prototype.setPos = function(s, angle) {
    totalTheta = angle - off;
    if (isExp) {
        p1 = this.exports[thisYear - START].a['amount'];
        p2 = this.exports[thisYear - START].b['amount'];
        p3 = this.exports[thisYear - START].c['amount'];
        p4 = this.exports[thisYear - START].d['amount'];
        p5 = this.exports[thisYear - START].e['amount'];
        p6 = 100 - p1 - p2 - p3 - p4 - p5;
    } else {
        p1 = this.imports[thisYear - START].a['amount'];
        p2 = this.imports[thisYear - START].b['amount'];
        p3 = this.imports[thisYear - START].c['amount'];
        p4 = this.imports[thisYear - START].d['amount'];
        p5 = this.imports[thisYear - START].e['amount'];
        p6 = 100 - p1 - p2 - p3 - p4 - p5;
    }
    theta1 = totalTheta * p1 / 100;
    theta2 = totalTheta * p2 / 100;
    theta3 = totalTheta * p3 / 100;
    theta4 = totalTheta * p4 / 100;
    theta5 = totalTheta * p5 / 100;
    theta6 = totalTheta * p6 / 100;

    d = Math.PI * s / 180;
    this.x0 = cx + (r * Math.cos(d));
    this.y0 = cy - (r * Math.sin(d));
    s += off;
    d = Math.PI * s / 180;
    this.x1 = cx + (r * Math.cos(d));
    this.y1 = cy - (r * Math.sin(d));
    s += theta1;
    d = Math.PI * s / 180;
    this.x2 = cx + (r * Math.cos(d));
    this.y2 = cy - (r * Math.sin(d));
    s += theta2;
    d = Math.PI * s / 180;
    this.x3 = cx + (r * Math.cos(d));
    this.y3 = cy - (r * Math.sin(d));
    s += theta3;
    d = Math.PI * s / 180;
    this.x4 = cx + (r * Math.cos(d));
    this.y4 = cy - (r * Math.sin(d));
    s += theta4;
    d = Math.PI * s / 180;
    this.x5 = cx + (r * Math.cos(d));
    this.y5 = cy - (r * Math.sin(d));
    s += theta5;
    d = Math.PI * s / 180;
    this.x6 = cx + (r * Math.cos(d));
    this.y6 = cy - (r * Math.sin(d));
    s += theta6;
    d = Math.PI * s / 180;
    this.x7 = cx + (r * Math.cos(d));
    this.y7 = cy - (r * Math.sin(d));

}

function Country(file) {
    obj = Utils.loadJSON(file);
    this.exports = [];
    this.imports = [];

    this.name = obj['country'];

    for (i = 0; i < obj['exports'].length; i++) {
        y = i + START + "";
        t = obj['exports'][i][y][0];
        a = obj['exports'][i][y][1];
        b = obj['exports'][i][y][2];
        c = obj['exports'][i][y][3];
        d = obj['exports'][i][y][4];
        e = obj['exports'][i][y][5];
        newYear = new Year(t, a, b, c, d, e);

        this.exports.push(newYear);
    }

    for (i = 0; i < obj['imports'].length; i++) {
        y = i + START + "";
        t = obj['imports'][i][y][0];
        a = obj['imports'][i][y][1];
        b = obj['imports'][i][y][2];
        c = obj['imports'][i][y][3];
        d = obj['imports'][i][y][4];
        e = obj['imports'][i][y][5];
        newYear = new Year(t, a, b, c, d, e);

        this.imports.push(newYear);
        this.arcs = [];
    }
}

function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Year(t, a, b, c, d, e) {
    this.total = t;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
}

$(document).change(function(e) {
    button = $("#pickers input[type='radio']:checked").val();
    if (button == "import")
        isExp = false;
    else
        isExp = true;

    draw();
});

$(document).ready(function() {
    init();
    draw();
});
