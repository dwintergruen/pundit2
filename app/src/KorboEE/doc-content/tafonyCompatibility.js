/**
@ngdoc tutorial
@name TafonyCompatibility
@module KorboEE
@description

# Tafony Compatibility

To use widget with Tafony Compatibility, you needs to set it in configuration object and specifies a name and ID for Tafony.

## How to configure it

Example of configuration
<pre>
{
    useTafonyCompatibility: true,
    tafonyId: 'your_own_tafony_id',
    tafonyName: 'your_own_tafony_name',
    nameInputHiddenUri: 'your_name_korbo_uri',
    nameInputHiddenLabel: 'your_name_korbo_label'
}
</pre>

## How it works
In this mode, the widget will be rendered as an input text, where its name and id are `tafonyName` and `tafonyId` set in configuration.
Input text will contain the entity label.

Moreover, will be added two input hidden, containing location and label of entity created or used.

Name of those input hidden are created in the following way:

  * `{{nameInputHiddenUri}}` for hidden input containing location
  * `{{nameInputHiddenLabel}}` for hidden input containing label


```html
<input type="text" name="{{tafonyName}}" id="{{tafonyId}}" />
<input type="hidden" name="{{nameInputHiddenUri}}" value="{{location}}" />
<input type="hidden" name="{{nameInputHiddenLabel}}" value="{{label}}" />
```
 **/


