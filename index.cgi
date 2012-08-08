#!/usr/bin/env perl
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use strict;
use warnings;

my $cgi = new CGI;
print $cgi->header();
print $cgi->start_html("webgl test");
print q(
<style type="text/css">
div{position:absolute;}
.a{top:0px;left;0px}
</style>
<div id="canvas" align="center"></div>
<div id="sound_element"></div>
<div id="rotation" align="center"></div>
<script type="text/javascript" src="./src/Three.js"></script>
<script type="text/javascript" src="./src/windowSize.js"></script>
<script type="text/javascript" src="./src/scroll.js"></script>
<script type="text/javascript" src="./src/main.js"></script>
);
print $cgi->end_html();
