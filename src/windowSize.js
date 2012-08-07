function getBrowserWidth() {
    if ( window.innerWidth ) {
	return window.innerWidth;
    }
    else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
	return document.documentElement.clientWidth;
    }
    else if ( document.body ) {
	return document.body.clientWidth;
    }
    return 0;
}

function getBrowserHeight() {
    if ( window.innerHeight ) {
	return window.innerHeight;
    }
    else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
	return document.documentElement.clientHeight;
    }
    else if ( document.body ) {
	return document.body.clientHeight;
    }
    return 0;
}
