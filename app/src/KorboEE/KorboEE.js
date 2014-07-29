/**
 * @ngdoc module
 * @name KorboEE
 * @module KorboEE
 * @description Korbo Entity Editor Widget
 **/
angular.module('KorboEE', ['korboee-templates', 'templates-main', 'APIModule', 'mgcrea.ngStrap', 'Pundit2.Core']);
/**
 * @ngdoc overview
 * @name AutoCompleteMode
 * @module KorboEE
 * @description
 *
 * # Auto Complete Search

 It is possible to use an autocomplete search in two different way:
 * `useAutocompleteWithNew`: if no entity is found, it is possible to create a new one
 * `useAutocompleteWithSearch`: if no entity is found, it is possible to search it using other providers
 *
 **/