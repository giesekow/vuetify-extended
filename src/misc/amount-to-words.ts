function toNum(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] == "0") {
      str.replace("0", "");
    } 
    else {
      break;
    }
  }
  return Number(str);
}

function convert(x: any) {
  const num = toNum(x);
  let str = "";
  const digits = num.toString().length;
  switch (digits) {
    case 1:
      str = single(num);
      break;
    case 2:
      str = twoDig(num);
      break;
    case 3:
      str = threeDig(num);
      break;
    case 4:
      str = fourDig(num);
      break;
    case 5:
      str = fiveDig(num);
      break;
    case 6:
      str = sixDig(num);
      break;
    case 7:
      str = sevenDig(num);
      break;
    case 8:
      str = eightDig(num);
      break;
    case 9:
      str = nineDig(num);
      break;
    case 10:
      str = tenDig(num);
      break;
    case 11:
      str = elevenDig(num);
      break;
    case 12:
      str = twelveDig(num);
      break;
    default:
      str = bigDig(x);
      break;
  }
  return str;
}

function single(num: any) {
  let str = "";
  switch (num) {
    case 0:
      str = "zero";
      break;
    case 1:
      str = "one";
      break;
    case 2:
      str = "two";
      break;
    case 3:
      str = "three";
      break;
    case 4:
      str = "four";
      break;
    case 5:
      str = "five";
      break;
    case 6:
      str = "six";
      break;
    case 7:
      str = "seven";
      break;
    case 8:
      str = "eight";
      break;
    case 9:
      str = "nine";
      break;
  }
  return str;
}

function twoDig(num: any) {
  let str = "";
  if (num.toString()[1] == "0") {
    switch (num) {
      case 10:
        str = "ten";
        break;
      case 20:
        str = "twenty";
        break;
      case 30:
        str = "thirty";
        break;
      case 40:
        str = "fourty";
        break;
      case 50:
        str = "fifty";
        break;
      case 60:
        str = "sixty";
        break;
      case 70:
        str = "seventy";
        break;
      case 80:
        str = "eighty";
        break;
      case 90:
        str = "ninety";
        break;
    }
  } 
  else if (num.toString()[0] == "1") {
    switch (num) {
      case 11:
        str = "eleven";
        break;
      case 12:
        str = "twelve";
        break;
      case 13:
        str = "thirteen";
        break;
      case 14:
        str = "fourteen";
        break;
      case 15:
        str = "fifteen";
        break;
      case 16:
        str = "sixteen";
        break;
      case 17:
        str = "seventeen";
        break;
      case 18:
        str = "eighteen";
        break;
      case 19:
        str = "nineteen";
        break;
    }
  } 
  else {
    str = twoDig(Number(num.toString()[0] + "0")) + "-" + single(num % 10);
  }
  return str;
}

function threeDig(num: any) {
  let str = "";
  if (num % 100 == 0) {
    str = single(Number(num.toString()[0])) + "-hundred";
  } 
  else if (num.toString()[1] == "0") {
    str =
      threeDig(Number(num.toString()[0]) + "00") + " and " + single(num % 10);
  } 
  else {
    str =
      threeDig(Number(num.toString()[0]) + "00") + " and " + twoDig(num % 100);
  }
  return str;
}

function fourDig(num: any) {
  let str = "";
  if (num % 1000 == 0) {
    str = single(Number(num.toString()[0])) + "-thousand";
  } 
  else {
    str = fourDig(Number(num.toString()[0]) + "000") + ", " + convert(num.toString().slice(1));
  }
  return str;
}

function fiveDig(num: any) {
  let str = "";
  if (num % 1000 == 0) {
    str = twoDig(Number(num.toString()[0] + num.toString()[1])) + "-thousand";
  } 
  else {
    str = fiveDig(Number(num.toString()[0] + num.toString()[1] + "000")) + ", " + convert(num.toString().slice(2));
  }
  return str;
}

function sixDig(num: any) {
  let str = "";
  if (num % 100000 == 0) {
    str = single(Number(num.toString()[0])) + "-lac";
  } 
  else {
    str = sixDig(Number(num.toString()[0] + "00000")) + ", " + convert(num.toString().slice(1));
  }
  return str;
}

function sevenDig(num: any) {
  let str = "";
  if (num % 1000000 == 0) {
    str = single(Number(num.toString()[0])) + "-million";
  } 
  else {
    str = sevenDig(Number(num.toString()[0] + "000000")) + ", " + convert(num.toString().slice(1));
  }
  return str;
}

function eightDig(num: any) {
  let str = "";
  if (num % 1000000 == 0) {
    str = twoDig(Number(num.toString()[0] + num.toString()[1])) + "-million";
  } 
  else {
    str = eightDig(Number(num.toString()[0] + num.toString()[1]) + "000000") + ", " + convert(num.toString().slice(2));
  }
  return str;
}

function nineDig(num: any) {
  let str = "";
  if (num % 1000000 == 0) {
    str = threeDig(Number(num.toString()[0] + num.toString()[1] + num.toString()[2])) + "-million";
  } 
  else {
    str = nineDig(Number(num.toString()[0] + num.toString()[1] + num.toString()[2]) +"000000") + ", " + convert(num.toString().slice(3));
  }
  return str;
}

function tenDig(num: any) {
  let str = "";
  if (num % 1000000000 == 0) {
    str = single(Number(num.toString()[0])) + "-billion";
  } 
  else {
    str = tenDig(Number(num.toString()[0] + "000000000")) + ", " + convert(num.toString().slice(1));
  }
  return str;
}

function elevenDig(num: any) {
  let str = "";
  if (num % 1000000000 == 0) {
    str = twoDig(Number(num.toString()[0] + num.toString()[1])) + "-billion";
  } 
  else {
    str = elevenDig(Number(num.toString()[0] + num.toString()[1] + "000000000")) + ", " + convert(num.toString().slice(2));
  }
  return str;
}

function twelveDig(num: any) {
  let str = "";
  if (num % 1000000000 == 0) {
    str = threeDig(Number(num.toString()[0] + num.toString()[1] + num.toString()[2])) + "-billion";
  } 
  else {
    str = twelveDig(Number(num.toString()[0] + num.toString()[1] + num.toString()[2] + "000000000")) + ", " + convert(num.toString().slice(3));
  }
  return str;
}

function bigDig(str: string) 
{
  const str1 = str.slice(0, -12);
  const str2 = str.slice(-12);
  return convert(str1) + "-trillion, " + convert(str2);
}

export const toWords = convert;