function encodePassword(password, key) {
  var pass = strToByteArray(password);
  var keys = strToByteArray(key);
  var encoded = [pass.length];
  for (var z = 0; z < pass.length; z++) {
    encoded[z] = implementXor(pass[z], keys[z % keys.length]);
  }
  return btoa(String.fromCharCode.apply(null, encoded));
}

function strToByteArray(str) {
  var arr = [];
  for (var i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i));
  }
  return arr;
}

function implementXor(left, right) {
  var one = (left).toString(2);
  var two = (right).toString(2);
  var result = "";
  if(one.length > two.length)  {
    while(one.length > two.length) {
      two = "0"+two;
    }
    for(var x = 0; x < one.length; x++){
      if(one[x] === two[x]) {
        result += "0";
      } else {
        result += "1";
      }
    }
  } else {
    while(two.length > one.length){
      one = "0" + one;
    }
    for(var y = 0; y < one.length; y++){
      if(one[y] === two[y]) {
        result += "0";
      } else {
        result += "1";
      }
    }
  }
  return parseInt(result, 2);
}
