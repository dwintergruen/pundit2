/**
  @ngdoc overview
  @name UseOnlyCallBack
  @module KorboEE
  @description

  # Use only Callback mode

  To use widget in OnlyCallBack mode, you needs to set it in configuration object the `useOnlyCallback` property

  Moreover, it is possible to define a function that will get called when component is ready to use. To do this, you need to define
  a onLoad function in configuration object

  ## How to configure it

  Example of configuration
  <pre>
    {
        useOnlyCallback: true,
        onLoad: function(){
            // code
        }
    }
  </pre>

  ## How it works

  In this case, no HTML input type will be rendered. It is possibile only use APICallback.

  For detailed use of APICallback, see documentation

  **/