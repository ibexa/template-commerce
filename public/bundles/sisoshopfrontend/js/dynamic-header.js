var userLogged = [
  {
    logged: 0
  }
];

var sesVmDynamicHeader = new Vue({
  el: "#ses-vm-dynamic_header",
  delimiters: ["${", "}"],

  data: {
    config: {},
    language_prefix: "",
    session_id: "anonymous",
    session_data: {},
    basket: "",
    basketMobile: "",
    login: '<div class="slogan"></div>',
    loginMobile: "",
    contact: "",
    logged: 0,
    basketSkuList: [],
    storedBasketsList: {},
    comparisonSkuList: [],
    csrfToken: "",
    isAnonymous: true,
    basketTotalSum: "",
    urlConfig: {},
    meta: {}
  },
  mounted: function() {
    //this.readConfig();
    this.urlConfig = JSON.parse(
      document.getElementById("ses-url-config").innerHTML
    );
    this.getLanguagePrefix();
  },
  created: function() {
    this.$on("app:call:getSessionData", function() {
      this.getSessionData();
    });
  },
  methods: {
    getMeta: function() {
      return this.meta;
    },
    getLanguagePrefix: function() {
      if ($("body").data("siteaccess").length > 1) {
        this.$set(this, "language_prefix", $("body").data("siteaccess"));
      }
    },
    getSessionData: function() {
      var vm = this;
      axios
        .get(this.urlConfig.urlGetSessionData, {
          headers: {
            "Cache-Control": "max-age=0",
            method: "GET",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "upgrade-insecure-requests": "1"
          }
        })
        .then(function(response) {
          var data = response.data;
          var basketType = "basket";
          // Create the event
          vm.meta = data.meta;
          store.set("ses", { csfr_token: vm.meta.token });
          console.log("Store token ..");
          vm.updateFlyoutContent(
            "js-" + basketType + "-flyout",
            data.modules.basket.htmlBasket
          );
          vm.updateHtml(data.modules);

          if (data.modules.comparison != undefined) {
            vm.updateComparisonCount(data.modules.comparison);
          }

          var event = new CustomEvent("ses:dynamic-data", {
            detail: response.data
          });
          document.dispatchEvent(event);
        });
    },
    updateComparisonCount: function(comparisonData) {
      if (comparisonData.skuList != undefined) {
        $("li.js-comparison-flyout .c-icon-bar__counter").html(
          comparisonData.skuList.length
        );
      }
    },
    updateHtml: function(modules) {
      for (module in modules) {
        for (component in modules[module]) {
          if (component == "html") {
            for (html in modules[module][component]) {
              $("#" + html).html(modules[module][component][html]);
            }
          }
        }
      }
    },
    updateFlyoutContent: function(field, content) {
      $("body").append('<div class="js-tmp hide"></div>');
      $(".js-tmp").append(content);
      if (content.trim() != "") {
        $(".js-icon-bar")
          .find("." + field)
          .replaceWith($(".js-tmp").find("." + field)[0].outerHTML);
      }
      $(".js-tmp").remove();
    }
  }
});

$(document).ready(function() {
  sesVmDynamicHeader.getSessionData();
});
