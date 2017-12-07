//pdf2csv.js

'use strict'; 
class PDF2CSVWrapper{
    _urldecode(url) {
        return decodeURIComponent(url.replace(/\+/g, ' '));
    }

    _getText(marks, ex, ey, v) {
        var x = marks[0].x;
        var y = marks[0].y;

        var txt = '';
        for (var i = 0; i < marks.length; i++) {
            var c = marks[i];
            var dx = c.x - x;
            var dy = c.y - y;

            if (Math.abs(dy) > ey) {
                txt += "\"\n\"";
                if (marks[i+1]) {
                    // line feed - start from position of next line
                    x = marks[i+1].x;
                }
            } else {
                if (Math.abs(dx) > ex) {
                    txt += "\",\"";
                }
            }

            var cell = '';
            for (var j = 0; j < c.R.length; j++) {
            cell += c.R[j].T;
            }
            txt += this._urldecode(cell);

            x = c.x;
            y = c.y;  
        }

        return txt;
    }

    _csv(pages) {
        var res = '"';
        for (var i = 0; i < pages.length; i++) {
            res += this._getText(pages[i].Texts, 1, 1, false);
        }
        return res + '"';
    }

    _ready(x) {
        console.log("ready: " + JSON.stringify(x));
        var data = x.data || x.formImage;
        return this._csv(data.Pages);
    }
    
    loadPDF(pdfName, successFnc, errorFnc){
        var PFParser = require('pdf2json');
        var pdfParser = new PFParser();
        pdfParser.on("pdfParser_dataReady",  pdfData => {
            successFnc(this._ready(pdfData));
        });
        pdfParser.on("pdfParser_dataError", error => errorFnc(error));
        pdfParser.loadPDF(pdfName);
    }
}
module.exports = PDF2CSVWrapper;
