// Enter your template code here

const getAllEventData = require('getAllEventData');
const JSON = require('JSON');
const makeString = require('makeString');
const sendHttpRequest = require('sendHttpRequest');
const encodeURIComponent = require('encodeUriComponent');
const logToConsole = require('logToConsole');

const eventData = getAllEventData();
const apiToken = data.adjust_api_token;

let baseURL = 'https://s2s.adjust.com/event?s2s=1';
let postBody = mapEvent(eventData, data);
logToConsole('Post Body: ', postBody);
let postWithURl = baseURL + postBody;

/* ---------- SEND ---------- */
sendHttpRequest(
  baseURL,
  (statusCode) => {
    if (statusCode >= 200 && statusCode < 400) {
      data.gtmOnSuccess();
    } else {
      data.gtmOnFailure();
    }
  },
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
  postBody,
);

function mapEvent(eventData, data) {
  // Body Container
  let body = [];

  // Required parameter
  const appToken = data.adjust_app_token;
  const advertisingId = getDeviceId(eventData);
  const environment = data.adjust_environment;

  // set event token
  let event_name = setEventName(eventData);
  const eventToken = getEventToken(event_name);

  // Add the Required parameter to the body
  body.push('app_token=' + encodeURIComponent(appToken));
  body.push('event_token=' + encodeURIComponent(eventToken));
  body.push('environment=' + encodeURIComponent(environment));
  if (advertisingId) {
    body.push('' + advertisingId);
  }
  if (eventData.currency) {
    body.push('currency=' + encodeURIComponent(eventData.currency));
  }

  // Add  Revenue events
  if (eventData.value && event_name == 'purchase') {
    body.push('revenue=' + encodeURIComponent(eventData.value));
  }

  // Recommended additional parameters for event submission
  let ip_address = eventData.ip_override;
  let created_at_unix = getSeconds(eventData['x-ga-timestamp_millis']);
  let user_agent = getEncodedUserAgent(eventData);

  // add the Recommended additional parameters to the body
  if (eventData.adid) {
    body.push('adid=' + encodeURIComponent(eventData.adid));
  }
  if (eventData.idfv) {
    body.push('idfv=' + encodeURIComponent(eventData.idfv));
  }

  body.push('ip_address=' + encodeURIComponent(ip_address));
  body.push('created_at_unix=' + encodeURIComponent(created_at_unix));
  body.push('user_agent=' + encodeURIComponent(user_agent));

  // Partner Params
  let callBackParams = {};

  // screen_view
  if (event_name == 'screen_view' && eventToken) {
    callBackParams = setScreenViewData(eventData);
  }

  // errors
  if (event_name == 'errors' && eventToken) {
    callBackParams = setErrorsData(eventData);
  }

  // search
  if (event_name == 'search' && eventToken) {
    callBackParams = setSearchData(eventData);
  }

  // button_click
  if (event_name == 'button_click' && eventToken) {
    callBackParams = setButtonClick(eventData);
  }

  // Sign Up and Log In
  if ((event_name == 'sign_up' && eventToken) || (event_name == 'login' && eventToken)) {
    callBackParams = setSignUpAndLogInData(eventData);
  }

  // availability
  if (event_name == 'availability' && eventToken) {
    callBackParams = setAvailabilityData(eventData);
  }

  // select_promotion
  if (event_name == 'select_promotion' && eventToken) {
    callBackParams = setSelectPromotionData(eventData);
  }

  // remove_from_wishlist
  if (event_name == 'remove_from_wishlist' && eventToken) {
    callBackParams = setRemoveFromWishlistData(eventData);
  }

  // view_cart | add_to_cart | view_item | select_item
  // view_promotion | | remove_from_cart | view_item_list
  // begin_checkout | add_shipping_info | add_payment_info
  // purchase | | add_to_wishlist | empty_cart | update_cart
  // refunds
  if (
    (event_name == 'view_cart' && eventToken) ||
    (event_name == 'add_to_cart' && eventToken) ||
    (event_name == 'view_item' && eventToken) ||
    (event_name == 'select_item' && eventToken) ||
    (event_name == 'remove_from_cart' && eventToken) ||
    (event_name == 'view_item_list' && eventToken) ||
    (event_name == 'view_promotion' && eventToken) ||
    (event_name == 'begin_checkout' && eventToken) ||
    (event_name == 'add_shipping_info' && eventToken) ||
    (event_name == 'add_payment_info' && eventToken) ||
    (event_name == 'add_to_wishlist' && eventToken) ||
    (event_name == 'purchase' && eventToken) ||
    (event_name == 'empty_cart' && eventToken) ||
    (event_name == 'update_cart' && eventToken) ||
    (event_name == 'refunds' && eventToken) ||
    (event_name == 'remove_from_wishlist' && eventToken)
  ) {
    callBackParams = setEcomEventData(eventData, event_name);
  }

  // remove_from_wishlist - custom events
  if (event_name == 'remove_from_wishlist' && eventToken) {
    callBackParams = setRemoveFromWishList(eventData);
  }

  // coupon_redemption
  if (event_name == 'coupon_redemption' && eventToken) {
    callBackParams = setCouponRedemptionData(eventData);
  }

  // add_shipping_address
  if (event_name == 'add_shipping_address' && eventToken) {
    callBackParams = setAddShippingAddressData(eventData);
  }

  // payment_failed
  if (event_name == 'payment_failed' && eventToken) {
    callBackParams = setPaymentFailedData(eventData);
  }

  // filter_used
  if (event_name == 'filter_used' && eventToken) {
    callBackParams = setFilterUsedData(eventData);
  }

  // filter_viewed || filter_conversion
  if (
    (event_name == 'filter_viewed' && eventToken) ||
    (event_name == 'filter_conversion' && eventToken)
  ) {
    callBackParams = setFilterViewedData(eventData);
  }

  // location_detection
  if (event_name == 'location_detection' && eventToken) {
    callBackParams = setlocationDetectionData(eventData);
  }

  // api_call
  if (event_name == 'api_call' && eventToken) {
    callBackParams = setApiCallData(eventData);
  }

  // order_type || select_patient || select_medicines
  // information || shipping || confirmation || order_success
  // erx_payment_type
  if (
    (event_name == 'order_type' && eventToken) ||
    (event_name == 'select_patient' && eventToken) ||
    (event_name == 'select_medicines' && eventToken) ||
    (event_name == 'information' && eventToken) ||
    (event_name == 'shipping' && eventToken) ||
    (event_name == 'confirmation' && eventToken) ||
    (event_name == 'order_success' && eventToken) ||
    (event_name == 'select_medicines' && eventToken)
  ) {
    callBackParams = setOrderData(eventData);
  }

  // order_experience_rating
  if (event_name == 'order_experience_rating' && eventToken) {
    callBackParams = setOrderExperienceRatingData(eventData);
  }

  // nuhdeek_benefit_purchase || nuhdeek_benefit_selected || nuhdeek_benefit_buy_now || nuhdeek_benefit_purchase_error
  if (
    (event_name == 'nuhdeek_benefit_selected' && eventToken) ||
    (event_name == 'nuhdeek_benefit_buy_now' && eventToken) ||
    (event_name == 'nuhdeek_benefit_purchase_error' && eventToken) ||
    (event_name == 'nuhdeek_benefit_purchase' && eventToken)
  ) {
    callBackParams = setNuhdeeksData(eventData);
  }

  // nuhdeek_family_add_member
  if (event_name == 'nuhdeek_family_add_member' && eventToken) {
    callBackParams = setNuhdeekFamilyAddMemberData(eventData);
  }

  // nuhdeek_family_invitation_response
  if (event_name == 'nuhdeek_family_invitation_response' && eventToken) {
    callBackParams = setNuhdeekFamilyInvitationResponseMemberData(eventData);
  }

  // add partner params to the body
  if (callBackParams) {
    body.push('callback_params=' + callBackParams);
  }

  return body.join('&');
}

/*------------------------------------------     Custom Events  Data     ------------------------------------ */
// Set screen_view data
function setScreenViewData(eventData) {
  const params = {
    event_name: eventData.event_name,
    screen_name: eventData.screen_name,
    screen_class: eventData.screen_class,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set ecommerce data
function setEcomEventData(eventData, event_name) {
  const params = {
    event_name: event_name,
  };

  if (eventData.currency) {
    params.currency = eventData.currency;
  }

  if (eventData.value) {
    params.value = makeString(eventData.value);
  }

  if (eventData.item_list_name) {
    params.item_list_name = eventData.item_list_name;
  }

  if (eventData.item_list_id) {
    params.item_list_id = eventData.item_list_id;
  }

  if (eventData.dy_slot_id) {
    params.dy_slot_id = eventData.dy_slot_id;
  }

  if (eventData.dy_slot_id) {
    params.dy_slot_id = eventData.dy_slot_id;
  }

  if (eventData.shipping_tier) {
    params.shipping_tier = eventData.shipping_tier;
  }

  if (eventData.coupon) {
    params.coupon = eventData.coupon;
  }

  if (eventData.payment_type) {
    params.payment_type = eventData.payment_type;
  }

  if (eventData.items) {
    logToConsole('Items: ', eventData.items);
    params.items = JSON.stringify(eventData.items);
  }

  if (eventData.event_name == 'purchase') {
    params.transaction_id = makeString(eventData.transaction_id);
    params.tax = makeString(eventData.tax);
    params.shipping = makeString(eventData.shipping);
  }

  logToConsole('Event Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set Remove from WishList
function setRemoveFromWishList(eventData) {
  const params = {
    event_name: eventData.event_name,
    currency: eventData.currency,
    value: eventData.value,
    item_id: eventData.item_id,
    object_id: eventData.object_id,
    item_name: eventData.item_name,
    price: eventData.price,
    coupon: eventData.coupon,
    item_brand: eventData.item_brand,
    item_category: eventData.item_category,
    item_category2: eventData.item_category2,
    item_category3: eventData.item_category3,
    item_category4: eventData.item_category4,
    item_category5: eventData.item_category5,
    item_list_id: eventData.item_list_id,
    item_list_name: eventData.item_list_name,
    item_variant: eventData.item_variant,
    fulfillment_source: eventData.fulfillment_source,
    shelf_price: eventData.shelf_price,
    discount: eventData.discount,
    item_availability: eventData.item_availability,
    item_link: eventData.item_link,
    item_image_link: eventData.item_image_link,
  };

  logToConsole('Params: ', params);

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set Search Data
function setSearchData(eventData) {
  const params = {
    event_name: eventData.event_name,
    search_term: eventData.search_term,
    search_results_count: makeString(eventData.search_results_count),
  };

  logToConsole('Params: ', params);

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set Sign Up And LogIn
function setSignUpAndLogInData(eventData) {
  const params = {
    event_name: eventData.event_name,
    method: eventData.method,
    userId: eventData.userId,
    status: eventData.status,
    email: eventData.email,
    phone: eventData.phone,
    first_name: eventData.first_name,
    last_name: eventData.last_name,
    referral_url: eventData.referral_url,
    event_source: eventData.event_source,
  };

  if (eventData.total_purchases) {
    params.total_purchases = eventData.total_purchases;
  }

  if (eventData.total_revenue) {
    params.total_revenue = eventData.total_revenue;
  }

  if (eventData.total_purchases) {
    params.last_purchase_date = eventData.last_purchase_date;
  }

  logToConsole('Params: ', params);

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set Button Click
function setButtonClick(eventData) {
  const params = {
    event_name: eventData.event_name,
    button_name: eventData.button_name,
    button_destination: eventData.button_destination,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set availability data
function setAvailabilityData(eventData) {
  const params = {
    event_name: eventData.event_name,
    availability_status: eventData.availability_status,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set select_promotion
function setSelectPromotionData(eventData) {
  const params = {
    event_name: eventData.event_name,
    promotion_id: eventData.promotion_id,
    promotion_name: eventData.promotion_name,
    creative_name: eventData.creative_name,
    location_id: eventData.location_id,
    dy_decision_id: eventData.dy_decision_id,
    dy_variation_id: eventData.dy_variation_id,
    promotion_destination: eventData.promotion_destination,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set remove_from_wishlist data
function setRemoveFromWishlistData(eventData) {
  const params = {
    event_name: eventData.event_name,
    parameters: JSON.stringify({
      currency: eventData.currency,
      value: eventData.value,
      items: eventData.items,
    }),
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set nuhdeek_benefit_purchase || nuhdeek_benefit_selected
function setNuhdeeksData(eventData) {
  const params = {
    event_name: eventData.event_name,
    currency: eventData.currency,
    value: eventData.card_value.toString(),
    card_type: eventData.card_type,
    card_value: eventData.card_value.toString(),
    required_points: eventData.required_points.toString(),
  };

  // nuhdeek_benefit_purchase_error
  if (eventData.card_error_message) {
    params.card_error_message = eventData.card_error_message;
  }

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set nuhdeek_family_add_member
function setNuhdeekFamilyAddMemberData(eventData) {
  const params = {
    event_name: eventData.event_name,
    relationship: eventData.relationship,
  };

  logToConsole('Params: ', params);

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set nuhdeek_family_invitation_response
function setNuhdeekFamilyInvitationResponseMemberData(eventData) {
  const params = {
    event_name: eventData.event_name,
    response_status: eventData.response_status,
  };

  logToConsole('Params: ', params);

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set errors data
function setErrorsData(eventData) {
  const params = {
    event_name: eventData.event_name,
    error_message: eventData.error_message,
    error_location: eventData.error_location,
    error_type: eventData.error_type,
    page_name: eventData.page_name,
    page_type: eventData.page_type,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set coupon_redemption
function setCouponRedemptionData(eventData) {
  const params = {
    event_name: eventData.event_name,
    code: eventData.code,
    redemption_result: eventData.redemption_result,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set add_shipping_address
function setAddShippingAddressData(eventData) {
  const params = {
    event_name: eventData.event_name,
    userId: eventData.userId,
    country: eventData.country,
    city: eventData.city,
    address: eventData.address,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set payment_failed
function setPaymentFailedData(eventData) {
  const params = {
    event_name: eventData.event_name,
    method: eventData.method,
    reason: eventData.reason,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set filter_viewed || filter_conversion
function setFilterViewedData(eventData) {
  const params = {
    event_name: eventData.event_name,
    filters_array: JSON.stringify(eventData.filters_array),
  };

  if (eventData.conversion_trigger) {
    params.conversion_trigger = eventData.conversion_trigger;
  }

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set filter_used
function setFilterUsedData(eventData) {
  const params = {
    event_name: eventData.event_name,
    filter_name: eventData.filter_name,
    filter_value: eventData.filter_value,
    filter_value_id: eventData.filter_value_id,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set location_detection
function setlocationDetectionData(eventData) {
  const params = {
    event_name: eventData.event_name,
    location_status: eventData.location_status,
    city: eventData.location_status,
    district: eventData.location_status,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set api_call
function setApiCallData(eventData) {
  const params = {
    event_name: eventData.event_name,
    service: eventData.service,
    endpoint_name: eventData.endpoint_name,
    request_url: eventData.request_url,
    request_method: eventData.request_method,
    status_code: eventData.status_code,
  };

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// order_type || select_patient || select_medicines
// information || shipping || confirmation || order_success
// select_medicines
function setOrderData(eventData) {
  const params = {
    event_name: eventData.event_name,
    event_cat: eventData.event_cat,
    funnel_name: eventData.funnel_name,
    step_no: eventData.step_no.toString(),
  };

  // information
  if (eventData.insurance_company) {
    params.insurance_company = eventData.insurance_company;
  }

  // shipping
  if (eventData.shipping_method) {
    params.shipping_method = eventData.shipping_method;
  }
  if (eventData.store) {
    params.store = eventData.store;
  }
  if (eventData.ez_pill) {
    params.ez_pill = eventData.ez_pill;
  }

  // confirmation - all data  populated

  // order_success
  if (eventData.order_no) {
    params.order_no = eventData.order_no;
  }

  // select_medicines
  if (eventData.erx_payment_type) {
    params.erx_payment_type = eventData.erx_payment_type;
  }

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

// Set order_experience_rating
function setOrderExperienceRatingData(eventData) {
  const params = {
    event_name: eventData.event_name,
    service_type: eventData.service_type,
    rate_score: eventData.rate_score.toString(),
    rate_remark: eventData.rate_remark,
  };

  //  transaction_id
  if (eventData.transaction_id) {
    params.transaction_id = eventData.transaction_id;
  }

  // order_no
  if (eventData.order_no) {
    params.order_no = eventData.order_no;
  }

  // funnel_name
  if (eventData.funnel_name) {
    params.funnel_name = eventData.funnel_name;
  }

  // erx_payment_type
  if (eventData.erx_payment_type) {
    params.erx_payment_type = eventData.erx_payment_type;
  }

  logToConsole('Params: ', params);
  const encodedParams = encodeURIComponent(JSON.stringify(params));
  return encodedParams;
}

/*---------------------------------------- Helper Functions ----------------------------------------------------*/

// Helper function to add a property only if it has a value
function addIfExists(obj, key, value) {
  if (value !== undefined && value !== null && value !== '') {
    obj[key] = value;
  }
}

function getEventToken(eventName) {
  let appMode = data.adjust_apps_mode;
  let adjustEventToken = {};
  if (appMode == 'staging') {
    // Add / modify here for staging events
    adjustEventToken = {
      add_coupon: 'bodged',
      add_payment_info: 'xdlb4x',
      add_shipping_address: 'zbdeqb',
      add_shipping_info: '894drj',
      add_to_cart: 'qbh7as',
      add_to_wishlist: 'hr0nnf',
      api_call: '4erhmx',
      availability: 'mwxjf1',
      begin_checkout: 'm0wh50',
      button_click: 'gu2pqg',
      category_click: 'nn81m8',
      confirmation: 'qca4wn',
      coupon_redemption: 'g69lgw',
      empty_cart: '8sjchf',
      errors: 'x2ge7r',
      filter_conversion: 't0qt81',
      filter_used: '1ds7g1',
      filter_viewed: 'eocx5v',
      information: 'a84xho',
      leave_family_group: 'vvbs8a',
      location_detection: '4pkhwo',
      login: 'g36kwt',
      nuhdeek_benefit_buy_now: 'hafgn3',
      nuhdeek_benefit_purchase: '4fbvtv',
      nuhdeek_benefit_purchase_error: 'jcmaaj',
      nuhdeek_benefit_selected: 'yq8ukg',
      nuhdeek_family_add_member: 'gh7dmd',
      nuhdeek_family_invitation_response: '3j9obw',
      nuhdeek_family_invitation_view: 'ew137l',
      order_experience_rating: 'tkeulp',
      order_success: '15idec',
      order_type: 'qlmxzs',
      payment_failed: 'huclob',
      payment_type: 'eb8zl8',
      purchase: 'm0uc2i',
      refunds: '3v1xmb',
      remove_from_cart: 'q2szk0',
      remove_from_wishlist: 'xf0vkg',
      screen_view: '3bcqkm',
      search: 'bskhbv',
      select_item: 'uacs9n',
      select_medicines: '31ty5w',
      select_patient: 'smmkpp',
      select_promotion: '3raco6',
      shipping: '34pu9k',
      sign_up: '2v0etu',
      update_cart: 'vmdhy0',
      user_properties: 'ddmcsk',
      view_cart: 'zdykt3',
      view_item: 'md7oy5',
      view_item_list: 'j5evhd',
      view_promotion: 'zf9dly',
    };
  } else if (appMode == 'production') {
    // Add / modify here for production events
    adjustEventToken = {
      add_coupon: 'zdjky7',
      add_payment_info: 'pfnyc5',
      add_shipping_address: 'k4z1gt',
      add_shipping_info: 'ec5ci2',
      add_to_cart: '395sju',
      add_to_wishlist: 'elrezu',
      api_call: '9z67tk',
      availability: 'gmpdbc',
      begin_checkout: 'g2nz7y',
      button_click: 'cst1o5',
      category_click: 'tukde5',
      confirmation: 't7f2h0',
      coupon_redemption: '6j4u1t',
      empty_cart: 'g6ynb0',
      errors: 'htza3q',
      filter_conversion: 'h5dd4f',
      filter_used: 'ushi87',
      filter_viewed: 'qgylba',
      information: 'p0e4rl',
      leave_family_group: '65duco',
      location_detection: '7rvn7n',
      login: '8ot7k5',
      nuhdeek_benefit_buy_now: 'tyx3vf',
      nuhdeek_benefit_purchase: 'u8306e',
      nuhdeek_benefit_purchase_error: 'dszx6e',
      nuhdeek_benefit_selected: '31ofmv',
      nuhdeek_family_add_member: '193smo',
      nuhdeek_family_invitation_response: 'booz4m',
      nuhdeek_family_invitation_view: 'x29gri',
      order_experience_rating: 'j52itc',
      order_success: '8bce2e',
      order_type: '43wy7p',
      payment_failed: 'oc8gvd',
      payment_type: 'mv1ipg',
      purchase: 'thxlzq',
      refunds: 'kymkl0',
      remove_from_cart: 'amjyzt',
      remove_from_wishlist: 'qs81tz',
      screen_view: '3ud0v1',
      search: 'ahyxrc',
      select_item: 'geyi25',
      select_medicines: 'xd3rd5',
      select_patient: 'jiyl6i',
      select_promotion: 'ctoegh',
      shipping: '3j96mw',
      sign_up: 'uyxmot',
      signup: 'byekuw',
      update_cart: 'lx7ozp',
      user_properties: '3wqprz',
      view_cart: '59504t',
      view_item: 'dliptb',
      view_item_list: 'qnsp89',
      view_promotion: 'w7k03x',
    };
  } else {
    logToConsole('App mode not given');
    return null;
  }

  logToConsole('event name: ', eventName);
  logToConsole('adjustEventToken: ', adjustEventToken[eventName]);

  if (!adjustEventToken[eventName]) {
    logToConsole('No Event Token for: ', eventName);
    return null;
  }

  return adjustEventToken[eventName];
}

function getDeviceId(eventData) {
  const platform = eventData['x-ga-platform'];
  const resettableId = eventData['x-ga-resettable_device_id'];
  const madid = eventData.madid;

  logToConsole('madid: ', madid);
  logToConsole('x-ga-resettable_device_id: ', resettableId);

  // check the madid if available if not try to use x-ga-resettable_device_id
  let deviceId = madid || resettableId;

  // If both are missing, drop adid
  if (!deviceId) {
    logToConsole('No device ID found. Dropping adid.');
    return '';
  }

  let param = '';

  if (platform === 'android') {
    param += 'gps_adid=';
  } else if (platform === 'ios') {
    param += 'idfa=';
  } else {
    logToConsole('Unknown platform. Dropping adid.');
    return '';
  }

  return (param += deviceId);
}

function getEncodedUserAgent(eventData) {
  if (!eventData) return '';

  const platform = eventData['x-ga-platform'] || 'Android';
  const osVersion = eventData['x-ga-os_version'] || '';
  const deviceModel = eventData['x-ga-device_model'] || '';
  const appVersion = eventData.app_version || '';

  // Construct a common mobile User-Agent format
  const userAgent =
    'Mozilla/5.0 (Linux; ' +
    platform +
    osVersion +
    ';' +
    deviceModel +
    ') AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/115.0 Mobile Safari/537.36 App/' +
    appVersion;

  // URL-encode it for Adjust
  return userAgent;
}

// get seconds
function getSeconds(ms) {
  const remainder = ms % 1000;
  const seconds = (ms - remainder) / 1000;

  return seconds;
}

// this function to modify event name for update_cart and empty_cart
function setEventName(eventData) {
  let event_name = '';
  if (
    eventData.event_name == 'view_cart' &&
    eventData.event_action == 'cart_updated' &&
    eventData.item_ids != '[]'
  ) {
    event_name = 'update_cart';
  } else if (
    eventData.event_name == 'view_cart' &&
    eventData.event_action == 'cart_updated' &&
    eventData.item_ids == '[]'
  ) {
    event_name = 'empty_cart';
  } else {
    event_name = eventData.event_name;
  }

  return event_name;
}
