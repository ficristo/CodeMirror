// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function() {
  var mode = CodeMirror.getMode({indentUnit: 2}, "sass");
  // Since Sass has an indent-based syntax, is almost impossible to test correctly the indentation in all cases.
  // So disable it for tests.
  mode.indent = undefined;
  function MT(name) { test.mode(name, mode, Array.prototype.slice.call(arguments, 1)); }

  MT("comment",
     "[comment // this is a comment]",
     "[comment   also this is a comment]")

  MT("comment_multiline",
     "[comment /* this is a comment]",
     "[comment   also this is a comment]")

  MT("variable",
     "[variable-2 $page-width]: [number 800][unit px]")

  MT("global_attributes",
     "[tag body]",
     "  [property font]:",
     "    [property family]: [atom sans-serif]",
     "    [property size]: [number 30][unit em]",
     "    [property weight]: [atom bold]")

  MT("scoped_styles",
     "[builtin #contents]",
     "  [property width]: [variable-2 $page-width]",
     "  [builtin #sidebar]",
     "    [property float]: [atom right]",
     "    [property width]: [variable-2 $sidebar-width]",
     "  [builtin #main]",
     "    [property width]: [variable-2 $page-width] - [variable-2 $sidebar-width]",
     "    [property background]: [variable-2 $primary-color]",
     "    [tag h2]",
     "      [property color]: [keyword blue]")

  // Sass allows to write the colon as first char instead of a "separator".
  //   :color red
  // Not supported
  // MT("property_syntax",
  //    "[qualifier .foo]",
  //    "  :[property color] [keyword red]")

  MT("import",
     "[def @import] [string \"sass/variables\"]",
     // Probably it should parsed as above: as a string even without the " or '
     // "[def @import] [string sass/baz]"
     "[def @import] [tag sass]/[tag baz]")

  MT("def",
     "[def @if] [variable-2 $foo] [def @else]")

  MT("tag_on_more_lines",
    "[tag td],",
    "[tag th]",
    "  [property font-family]: [string \"Arial\"], [atom serif]")

  MT("important",
     "[qualifier .foo]",
     "  [property text-decoration]: [atom none] [keyword !important]",
     "[tag h1]",
     "  [property font-size]: [number 2.5][unit em]")

  // CSS doesn't highlight the : in pseudo selectors.
  MT("selector",
     "[tag h1][variable-3 :before],",
     "[tag h2][variable-3 :before]",
     "  [property content]: [string \"::\"]")

  // CSS doesn't highlight the : in pseudo selectors.
  MT("selectors",
     "*[variable-3 ::][meta -webkit-][variable-3 input-placeholder]",
     "  [property color]: [number #666]",
     "*[variable-3 :][meta -moz-][variable-3 placeholder]",
     "  [property opacity]: [number 1][unit px]",
     "[tag input][variable-3 ::][meta -ms-][variable-3 clear]",
     "  [property display]: [atom none]",
     "[tag input][variable-3 :][meta -webkit-][variable-3 autofill] ",
     "  [meta -webkit-][property box-shadow]:[number 0] [number 0] [number 5][unit px] [number #5cd053], [atom inset] [number 0] [number 0] [number 0] [number 50][unit px] [atom rgb]([number 255],[number 255],[number 255]) [keyword !important]")

  MT("definition_mixin_equal",
     "[variable-2 $defined-bs-type]: [atom border-box] [keyword !default]",
     "[meta =bs]([variable-2 $bs-type]: [variable-2 $defined-bs-type])",
     "  [meta -webkit-][property box-sizing]: [variable-2 $bs-type]",
     "  [property box-sizing]: [variable-2 $bs-type]")

  MT("definition_mixin_with_space",
     "[variable-2 $defined-bs-type]: [atom border-box] [keyword !default]",
     "[def @mixin] [tag bs]([variable-2 $bs-type]: [variable-2 $defined-bs-type]) ",
     "  [meta -moz-][property box-sizing]: [variable-2 $bs-type]",
     "  [property box-sizing]: [variable-2 $bs-type]")

  MT("numbers_start_dot_include_plus",
     "[meta =button-links]([variable-2 $button-base]: [atom darken]([variable-2 $color11], [number 10][unit %]))",
     "  [property padding]: [number .3][unit em] [number .6][unit em]",
     "  [variable-3 +border-radius]([number 8][unit px])",
     "  [property background-color]: [variable-2 $button-base]")

  MT("include",
     "[qualifier .bar]",
     "  [def @include] [tag border-radius]([number 8][unit px])")

  // CSS doesn't highlight the : in pseudo selectors.
  MT("reference_parent",
     "[qualifier .col]",
     "  [property clear]: [atom both]",
     "  &[variable-3 :after]",
     "    [property content]: [string '']",
     "    [property clear]: [atom both]")

  MT("reference_parent_with_spaces",
     "[tag section]",
     "  [property border-left]:  [number 20][unit px] [atom transparent] [atom solid] ",
     "  &[qualifier .section3]",
     "    [qualifier .title]",
     "      [property color]: [keyword white] ",
     "    [qualifier .vermas]",
     "      [property display]: [atom none]")

  MT("font_face",
     "[def @font-face]",
     "  [property font-family]: [string 'icomoon']",
     "  [property src]: [atom url]([string fonts/icomoon.ttf])")

/*
//Load Libs SASS
@import "fonts"

*::-webkit-input-placeholder
	color: #666
	opacity: 1

*:-moz-placeholder
	color: #666
	opacity: 1

*::-moz-placeholder
	color: #666
	opacity: 1

*:-ms-input-placeholder
	color: #666
	opacity: 1

input::-ms-clear
   display: none

input:-webkit-autofill 
	-webkit-box-shadow:0 0 5px #5cd053, inset 0 0 0 50px rgb(255,255,255) !important

input,
button,
textarea
	outline: 0

body input:focus:required:invalid,
body textarea:focus:required:invalid
	color: #666
body input:required:valid,
body textarea:required:valid
	color: #666

body
	font-size: 16px
	min-width: 320px
	position: relative
	line-height: 1.6
	font-family: "RobotoRegular", sans-serif
	overflow-x: hidden

.hidden
	display: none

.clr
	clear: both

.container
	margin-right: auto
	margin-left: auto

@media (min-width: 768px) 
	.container 
		width: 750px;

@media (min-width: 992px) 
	.container 
		width: 970px;

@media (min-width: 1200px)
	.container
		width: 1170px;
	
.container-fluid
	margin-right: auto
	margin-left: auto

//Custom Styles Here


//ALWAYS END
@import "media.sass"
*/
})();
