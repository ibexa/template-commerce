Vue.component("productselector", {
    template: `
       <div class="productselector">

          <div v-if="displayType == 'page'">
             <ol class="ibexa-collection__items">
                    <li class="ibexa-collection__item" v-for="(product,index) in sku_list" :key="product.sku">
                        <div>
                            <!-- svg class="ibexa-icon ibexa-icon--secondary">
                                <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#drag"></use>
                            </svg -->
                        </div>
                        <div class="ibexa-collection__item-name">{{ product.name }} {{ index }} {{ sku_list.length }}</div>
                        <div v-for="field in addfieldstostore" >
                           {{ field }} <input @change="storeComment" v-model="product.note" >
                        </div>
                        <div class="ibexa-collection__item-content-type"></div>
                        <div class="ibexa-collection__item-trash" v-if="index > 0">
                                 <svg class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary" @click="skuUp(index)">
                                    <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#caret-up"></use>
                                </svg>
                         </div>
                         <div class="ibexa-collection__item-trash" v-if="index < sku_list.length -1">
                                <svg class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary" @click="skuDown(index)">
                                    <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#caret-down"></use>
                                </svg>
                          </div>
                         <div class="ibexa-collection__item-trash">
                                <svg class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary" @click="removeSku(index)">
                                    <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#trash"></use>
                                </svg>
                        </div>
                    </li>
             </ol>
          </div>
          <div v-if="displayType == 'table'" class="ibexa-relations__wrapper ">
             <table class="table ibexa-relations__table">
                <thead>
                    <tr class="ibexa-relations__table-header" >
                         <th colspan="6">Selected products</th>
                    </tr>
                </thead>
                <tbody class="ibexa-relations__list" data-limit="1" data-default-location="0" data-allowed-content-types="">

                    <tr v-for="(product,index) in sku_list" :key="product.sku" class="ibexa-relations__item" data-content-id="">
                        <td>
                           <img v-if="product.image != undefined" :src="product.image" height="40px" />
                        </td>
                        <td class="ibexa-relations__item-name">{{ product.sku }}</td>
                        <td class="ibexa-relations__item-name">{{ product.name }}
                        <div v-for="field in addfieldstostore" >
                           {{ field }} <input @change="storeComment" v-model="product.note" >
                        </div>
                        </td>
                        <td>
                            <div class="ibexa-collection__item-trash" v-if="index > 0">
                                     <svg class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary" @click="skuUp(index)">
                                        <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#caret-up"></use>
                                    </svg>
                             </div>
                        </td>
                        <td>
                             <div class="ibexa-collection__item-trash" v-if="index < sku_list.length -1">
                                    <svg class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary" @click="skuDown(index)">
                                        <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#caret-down"></use>
                                    </svg>
                              </div>
                        </td>
                        <td>
                             <div class="ibexa-collection__item-trash">
                                    <svg class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary" @click="removeSku(index)">
                                        <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#trash"></use>
                                    </svg>
                            </div>

                        </td>
                    </tr>
                 </tbody>
             </table>


          </div>

          <div>

          <div class="input-group">
            <input onKeyPress="return noenter()" v-model="searchTerm" v-on:keyup.enter="searchProducts(searchTerm)" type="search" placeholder="Search for SKU or product name" class="form-control">

            <span class="input-group-btn">
                <div @click="searchProducts(searchTerm)" class="btn ibexa-btn ibexa-btn--primary">
                    Search
                </div>
            </span>
            </div>

            <ol class="ibexa-collection__items">
              <li style="border: 2px solid #106d95" v-for="(sku,index) in productSuggestions" class="ibexa-collection__item">
                <div class="ibexa-collection__item-name"><span  v-if="sku.data.sku != ''">
                  {{ sku.value }}
                </span>
                </div>
                <div class="ibexa-collection__item-content-type"></div>
                <svg @click="addSku(index)" style="cursor:pointer" class="ibexa-icon ibexa-icon--medium ibexa-icon--secondary">
                  <use xlink:href="/bundles/ibexaadminui/img/ibexa-icons.svg#create"></use>
                </svg>
              </li>
            </ol>

            <span v-if="message != ''">{{ message }}</span>
          </div>
      </div>
       `,
    data: function () {
        return {
            message: '',
            drag: false,
            url: '/admin/search_autosuggest',
            sku_list: [],
            suggestions: {},
            searchTerm: '',
            jsonText: ''
        }
    },
    props: {
        json: String,
        resturl: String,
        fieldid: String,
        addfields: Array,
        displayType: {
            type: String,
            default: function () {
                return "page"
            }
        },
    },
    computed: {
        productSuggestions: function () {

            var productSuggestions = [];
            for (var index in this.suggestions) {
                if (this.suggestions[index].data.sku != undefined) {
                    productSuggestions.push(this.suggestions[index]);
                }
            }
            return productSuggestions;
        },
        addfieldstostore: function () {
            if (this.addfields != undefined) {
                console.log("AddFields got "+this.addfields);
                var fieldlist = JSON.parse(this.addfields)

                console.log(fieldlist)
                return fieldlist;
            }
            return [];
        }
    },
    mounted: function(){

        if (this.fieldid != '')
        {
             $('#'+this.fieldid).hide();
             var jsoncontent = $('#'+this.fieldid).val();
             if (jsoncontent != '') {
                 console.log('productselector got '+jsoncontent);
                 this.sku_list = JSON.parse(jsoncontent)
                 console.log(this.sku_list);
             }
        }
    },
    methods: {
        searchProducts: function (term) {
            console.log("Search ..."+term);
            this.message = '';
                this.$http.get(this.url + '?search_terms='+term
            ).then(function(response) {
                var result = JSON.parse(response.body)
                this.suggestions = result.suggestions;
                console.log('suggestions: ' + result);
                if (this.productSuggestions.length == 0) {
                    this.message = "No product found ..";
                }
            });
        },
        skuUp: function(index) {
            console.log("skuUp : "+ index);
            this.swapArray(this.sku_list, index, index-1)
            console.log(this.sku_list);
        },
        skuDown: function(index) {
            this.swapArray(this.sku_list, index, index+1)
            console.log("skuDown : "+ index);
            console.log(this.sku_list);
        },
        swapArray: function (arr, a, b) {
            var temp = this.sku_list[a];

            this.sku_list[a] = this.sku_list[b];
            this.sku_list[b] = temp;
            newLine = {};
            this.sku_list.push(newLine);
            this.sku_list.splice(this.sku_list.length-1, 1);
            this.jsonText = JSON.stringify(this.sku_list);
            $('#'+this.fieldid).val(this.jsonText);

            return arr;
        },
        removeSku: function(index) {
            this.sku_list.splice(index, 1);
            this.jsonText = JSON.stringify(this.sku_list);
            $('#'+this.fieldid).val(this.jsonText);
        },
        storeComment: function () {
            this.jsonText = JSON.stringify(this.sku_list);
            $('#'+this.fieldid).val(this.jsonText);

        },
        addSku(index) {
            console.log('Add '+index+' Value: '+this.suggestions[index].value)
            var newLine = {
                sku: this.suggestions[index].data.sku,
                name: this.suggestions[index].value,
                note: '',
                image: this.suggestions[index].data.image
            }
            this.sku_list.push(newLine);

            console.log(this.sku_list);
            this.jsonText = JSON.stringify(this.sku_list);
            $('#'+this.fieldid).val(this.jsonText);


        }
    }
});

function noenter() {
  return !(window.event && window.event.keyCode == 13);
}