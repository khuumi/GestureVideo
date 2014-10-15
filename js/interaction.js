/**
	All of the main javascript for the gesture based interaction
	Daniel Maxson

*/
function generate(textinput) {
    var n = noty({
        text: textinput,
        type: 'success',
        dismissQueue: true,
        animation: {
            open: {
                height: 'toggle'
            },
            close: {
                height: 'toggle'
            },
            easing: 'swing',
            speed: 500 // opening & closing animation speed
        },
        maxVisible: 2,
        layout: 'topRight',
        theme: 'defaultTheme',
        timeout: 1500,
        force: true
    });
}

function welcomeMessage() {
    var n = noty({
        text: "Welcome to mouse gesture controlled video player! Why don't you go ahead and take a look at the mouse gestures listed on the left hand side tab to get yourself comfortable with the type of gestures we support. When you are ready first click on this message to make it go away and then click and drag your gestures right on top of the video. Have fun! ",
        type: 'welcome',
        dismissQueue: true,
        animation: {
            open: {
                height: 'toggle'
            },
            close: {
                height: 'toggle'
            },
            easing: 'swing',
            speed: 500 // opening & closing animation speed
        },
        maxVisible: 2,
        layout: 'center',
        theme: 'defaultTheme',
        timeout: false,
        force: true
            //timeout: "3000"
    });
}
$(document).ready(function() {
    welcomeMessage();
    $("#extruderLeft").buildMbExtruder({
        position: "left",
        width: 200,
        extruderOpacity: .8,
        hidePanelsOnClose: true,
        accordionPanels: true,
        onExtOpen: function() {},
        onExtContentLoad: function() {},
        onExtClose: function() {}
    });

    var _isDown, _points, _r, _g, _rc;
    _points = new Array();
    _r = new DollarRecognizer();
    _video = $("video").get(0);
    canvas = $("#canvas").get(0);
    //var canvas = document.getElementById('canvas');
    _g = canvas.getContext('2d');
    _g.fillStyle = "rgb(0,0,225)";
    _g.strokeStyle = "rgb(0,0,225)";
    _g.lineWidth = 2;
    _g.font = "16px Gentilis";
    _rc = getCanvasRect(canvas); // canvas rect on page
    _g.fillStyle = "rgb(255,255,136)";
    //_g.fillRect(0, 0, canvas.width, 20);
    _isDown = false;
    $("#canvas").mousedown(function(event) {
        mouseDownEvent(event.clientX, event.clientY);
    });
    $("#canvas").mousemove(function(event) {
        mouseMoveEvent(event.clientX, event.clientY);
    });
    $("#canvas").mouseup(function(event) {
        mouseUpEvent(event.clientX, event.clientY);
    });

    function getCanvasRect(canvas) {
        var w = canvas.width;
        var h = canvas.height;
        var cx = canvas.offsetLeft;
        var cy = canvas.offsetTop;
        while (canvas.offsetParent != null) {
            canvas = canvas.offsetParent;
            cx += canvas.offsetLeft;
            cy += canvas.offsetTop;
        }
        return {
            x: cx + 140,
            y: cy,
            width: w,
            height: h
        };
    }

    function getScrollY() {
            var scrollY = 0;
            if (typeof(document.body.parentElement) != 'undefined') {
                scrollY = document.body.parentElement.scrollTop; // IE
            } else if (typeof(window.pageYOffset) != 'undefined') {
                scrollY = window.pageYOffset; // FF
            }
            console.log(scrollY);
            return scrollY;
        }
        //
        // Mouse Events
        //

    function mouseDownEvent(x, y) {
        document.onselectstart = function() {
                return false;
            } // disable drag-select
        document.onmousedown = function() {
                return false;
            } // disable drag-select
        _isDown = true;
        x -= _rc.x;
        y -= _rc.y - getScrollY();
        if (_points.length > 0) _g.clearRect(0, 0, _rc.width, _rc.height);
        _points.length = 1; // clear
        _points[0] = new Point(x, y);
        _g.fillStyle = "rgb(255,255,136)";
        //_g.fillRect(0, 0, _rc.width, 20);
        //drawText("Recording unistroke...");
        _g.fillStyle = "rgb(0,0,255)";
        //	_g.fillRect(x , y, 9, 9);
    }

    function mouseMoveEvent(x, y) {
        if (_isDown) {
            x -= _rc.x;
            y -= _rc.y - getScrollY();
            _points[_points.length] = new Point(x, y); // append
            //	drawConnectedPoint(_points.length - 2, _points.length - 1);
        }
    }

    function mouseUpEvent(x, y) {
        document.onselectstart = function() {
                return true;
            } // enable drag-select
        document.onmousedown = function() {
                return true;
            } // enable drag-select
        if (_isDown) {
            _isDown = false;
            if (_points.length >= 10) {
                var result = _r.Recognize(_points, true);
                _g.fillStyle = "rgb(255,255,136)";
                controlPlayback(result.Name);
            } else // fewer than 10 points were inputted
            {
                //drawText("Too few points made. Please try again.");
            }
        }
    }

    function controlPlayback(name) {
        console.log(name + "yo dude");
        switch (name) {
            case "pigtail":
                if (_video.paused == true) {
                    _video.play();
                    generate("Playing");
                } else {
                    _video.pause();
                    generate("Pausing")
                }
                break;
            case "circle":
                if (_video.muted == false) {
                    _video.muted = true;
                    generate("Video Muted");
                } else {
                    _video.muted = false;
                    generate("Video Un-Muted");
                }
                break;
            case "caret":
                if (_video.volume == 1) {
                    generate("Volume already at highest");
                } else {
                    _video.volume += 0.1;
                    generate("Volume increased");
                }
                break;
            case "v":
                if (_video.volume < 0.1) {
                    generate("Volume already at lowest");
                } else {
                    _video.volume -= 0.1;
                    generate("Volume descreased");
                }
                break;
            case "right square bracket":
                _video.currentTime += 5;
                generate("Jumped forward 5 seconds");
                break;
            case "left square bracket":
                _video.currentTime -= 5;
                generate("Jumped back 5 seconds");
                break;
            case "W":
                _video.width = 1000;
                _video.height = 500;
                canvas.width = 1000;
                canvas.height = 460;
                generate("Wide-View");
                break;
            case "M":
                _video.width = 500;
                _video.height = 285;
                canvas.width = 500;
                canvas.height = 260;
                generate("Mini-View");
                break;
            case "arrow":
                _video.playbackRate += 1;
                generate("Playback rate is now " + _video.playbackRate);
                break;
            case "arrowdown":
                _video.playbackRate -= 1;
                generate("Playback rate is now " + _video.playbackRate);
                break;
        }
    }

    function drawText(str) {
        _g.fillStyle = "rgb(255,255,136)";
        _g.fillRect(0, 0, _rc.width, 20);
        _g.fillStyle = "rgb(0,0,255)";
        _g.fillText(str, 1, 14);
    }

    function drawConnectedPoint(from, to) {
        _g.beginPath();
        _g.moveTo(_points[from].X, _points[from].Y);
        _g.lineTo(_points[to].X, _points[to].Y);
        _g.closePath();
        _g.stroke();
    }

    function round(n, d) // round 'n' to 'd' decimals
        {
            d = Math.pow(10, d);
            return Math.round(n * d) / d
        }
        //
        // Unistroke Adding and Clearing
        //

    function onClickAddExisting() {
        if (_points.length >= 10) {
            var unistrokes = document.getElementById('unistrokes');
            var name = unistrokes[unistrokes.selectedIndex].value;
            var num = _r.AddGesture(name, _points);
            drawText("\"" + name + "\" added. Number of \"" + name +
                "\"s defined: " + num + ".");
        }
    }

    function onClickAddCustom() {
        var name = document.getElementById('custom').value;
        if (_points.length >= 10 && name.length > 0) {
            var num = _r.AddGesture(name, _points);
            drawText("\"" + name + "\" added. Number of \"" + name +
                "\"s defined: " + num + ".");
        }
    }

    function onClickCustom() {
        document.getElementById('custom').select();
    }

    function onClickDelete() {
        var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
        alert(
            "All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " +
            num + " types.");
    }
});
// --