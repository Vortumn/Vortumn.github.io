var x_values = {};

function SolveSystem()
{
  x_values = {};
  var d=window.document.Form;

  if(d.form.value == "")
  {
    alert("Заполните форму с кнф");
  }

  else var str = d.form.value;

//где-то до словарика займемся проверкой на юниты и другой неинтересной деятельностью
units = {}; //cловарь под unit-переменные
/*var i = 0;
var f;
while (i < str.length)
{
    var f = 0;
    if(str.charAt(i) == "(")
    {
       
       var unit_coeff;
       var unit_value;
      while(str.charAt(i) != ")")
        {
        i++;
        if (str.charAt(i) == "x")
        {
            f++;
            var not = 0;
            i--;
            if (str.charAt(i) == "!") //костыль для проверки нужного присваивания для unit-а
            {
            not = 1;
            }
            i++;

          i++;
          unit_coeff = str.charAt(i);
          if (not == 0) unit_value = true;
          else unit_value = false;

          i++;
        }
        }
        if (f == 1) units["x" + unit_coeff] = unit_value; //добавление в словарь unit-ов ключ-значение
    }
   i++;
  }
*/

  //сначала находим переменные функции, делаем под них словарик и производим подсчёт N 
  var i = 0;
  while(i < str.length)
  {
    if (str.charAt(i) == "x")
    {
    i++;
    var x = "x"+str.charAt(i);
    if (x in units)
    {
    x_values[x] = units[x];
    }
    else x_values[x] = true;
    }
    i++;
  }
  
  var N = 0; 
  
  for(key in x_values) //посчитали количество участвующих переменных
  {
   N++;
  }

//проверка чистых переменных
for(var i = 1; i < (N+1); i++)
{
  var flag = 0; //переменная для провеки на наличие разницы в знаках (на проверку чистых переменных)
  var curr = 0; 
  var value_met = 0; //количество встреч переменной в формуле
  while (curr < str.length)
    {
      if (str.charAt(curr) == "x")
        {
        curr++;
        if (str.charAt(curr) == i) //если нашли в цикле текущую просматриваемую переменную
          {
            value_met++;
            curr = curr - 2;
            if (str.charAt(curr) == "!") flag ++;
            curr = curr + 2;
          }
        }
      curr++;
    }
if (value_met == flag) units["x" + i] = false;
else if (flag == 0 && value_met >= 1) units["x" + i] = true;

}

//маленький цикл проверки на чистые переменные в самом начале (чтобы попасть в набор с одного выстела)
var exclamation = 0;
var curr = 0;
while(curr < str.length)
{
if(str.charAt(curr) == "!") exclamation++;
curr++;
}

if(exclamation == N || exclamation > (N/2))
{
  for(key in x_values)
    {
      if(key in units) x_values[key] = units[key];
      else x_values[key] = false;
    }
}


for(key in x_values)
{
  if(key in units) x_values[key] = units[key];
}


//теперь создаём массив для того, чтобы знать, что с чем перемножается 
var i = 0;
var arr = [];

while (i < str.length){
  if(str.charAt(i) == "(")
  {
        var stroke = '';
        while (str.charAt(i) != ")")
          {
            if (str.charAt(i) == "x")
            {
            i++;
            stroke = stroke + str.charAt(i);
            }

            if (str.charAt(i) == "!")
            {
            i+=2;
            stroke = stroke + '!' + str.charAt(i);
            }

            i++;
          }
  // alert(stroke);  
   arr.push(stroke); 
  } 
  i++;  
}
 FindSolution(N,arr); 
}


function Solve(arr)
{
var mult = true;
for(i = 0; i < arr.length; i++) //прогулка по массиву
  {
    
    var stroke = arr[i];
    b = 0;
    var sum = false;
    while (b < stroke.length) //прогулка по символам в строке
      {
        var value;
        if (stroke.charAt(b) != "!")
        {
        value = "x" + stroke.charAt(b);
        b++;
        sum = sum || x_values[value];  //от эта нужно уточнить
        }
        
        if (stroke.charAt(b) == "!")
          {
            b++;
            value = "x" + stroke.charAt(b);
            b++;
            sum = sum || !x_values[value];
          }
      } 
     mult = mult && sum; //произведение значений внутри скобок между собой
     if (mult == 0) break;
  }
return mult;
}

////////////////////////////////////////////////////////////////////

function CreateStr(xi,str)
{
  return str  + xi + str;
}

//////////////////////////////////////////////////////////////////////

function Ribbon(N)
{
var curr_str = "x" + N  + "x" + (N-1) + "x" + N;
if (N>2)
{
  var curr = N-1;
  while(curr > 2)
    {
      curr--;
      var xx = "x" + curr;
      curr_str = CreateStr(xx, curr_str);
    }

  return curr_str + "x1" + curr_str;
  }
else return curr_str + "x1" + curr_str;
}


function FindSolution(N, arr)
{
  var solves = Solve(arr);
  var ribbon = Ribbon(N);
  var d=window.document.Form;
  d.textarea.value = "";
  d.textarea.value += "Первостепенный набор значений задаётся всеми единицами для переменных (исключая unit-переменные), дальше производится перебор значений с проверкой переменной ветвления" + "\n" + "\n";
  var k = 1;

   d.textarea.value += "Первостепенный набор: " + "\n";
      for(key in x_values)
      {
       d.textarea.value += key + " : " + x_values[key];
       if (key in units) d.textarea.value += "(unit-переменная или чистая)" + "\n";
       else d.textarea.value += "\n";
      }

 while(k < ribbon.length)
    {
      if(solves == 1)
       {
         break;
       }

     var x_num =  "x" + ribbon.charAt(k); //находим x в ленте, который мы будем менять
     d.textarea.value += "\n" + "Переменная ветвления: " + x_num;
     while(x_num in units)
     {
      d.textarea.value += " (unit-переменная, поэтому выбираем следующую)" + "\n";
      k+=2;
      x_num =  "x" + ribbon.charAt(k); //делаем скип по ленте для юнита
      d.textarea.value += "Переменная ветвления: " + x_num;
     }
      d.textarea.value += "\n";
      k+=2;

     x_values[x_num] = !x_values[x_num]; //меняем значение выбранного по ленте x
     //alert(x_values[x_num]);
     solves = Solve(arr);
     if(solves == 1)
       {
         break;
       }
       
      d.textarea.value += "Рассматриваемый набор: " + "\n";
      for(key in x_values)
      {
       d.textarea.value += key + " : " + x_values[key] + "\n";
      }

    }

if (solves == 1)
  {
    //alert("You find solution");
    var stroke_for_print = "";
    d.textarea.value += "Решение: " + "\n";
    for(key in x_values)
    {
     d.textarea.value += key + " : " + x_values[key] + "\n";
    }
   //d.rez.value = stroke_for_print; 
  }

else (alert("Sorry but we can't find solution"));
}
////////////////////////////////////////////////////////////////////////


//var N = 5; //переменная величина так-то, которая будет либо считаться, либо считываться
//var str = "(x1 V x2) ^ (x5 V x4 V x3)"; //це типа парсер

//var x_values = {"x1" : false, "x2" : false , "x3" : true , "x4" : false, "x5": false};


//теперь у нас в arr хранятся номера коэффициентов из каждого подмножества, которые складываются между собой
//и которые должны на выходе между собой перемножаться

//alert(Ribbon(N));
//последний штрих, блин

/*
Exception: SyntaxError: expected expression, got '}'
onclick@file:///C:/Users/vrtmn/Desktop/DPLL/index.html:1:1
*/
/*
Exception: ReferenceError: invalid assignment left-hand side
@Scratchpad/4:218
*/