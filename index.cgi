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
<script type="text/javascript" src="./src/Three.js"></script>
<script type="text/javascript" src="./src/windowSize.js"></script>
<script type="text/javascript" src="./src/scroll.js"></script>
<script type="text/javascript" src="./src/main.js"></script>
<div id="canvas-wrapper" align="center"></div>
);
print $cgi->end_html();
