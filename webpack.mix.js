// webpack.mix.js

let mix = require('laravel-mix');


//compile resources files to public one.
mix.js('resources/js/app.js', 'public/js/app.js').sass("resources/scss/app.scss", "public/css/app.css")
