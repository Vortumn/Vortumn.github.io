var x_values = {};
var clauses = [];
//var x_n = [];

function SolveSystem()
{
  var start = new Date().getTime();
  x_values = {};
  var d=window.document.Form;

  if(d.form.value == "")
  {
    alert("Заполните форму с кнф");
  }

  else var str = d.form.value;


//где-то до словарика займемся проверкой на юниты и другой неинтересной деятельностью

units = {}; //cловарь под unit-переменные
var i = 0;
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
//маленький цикл проверки на чистые переменные в самом начале (чтобы попасть в набор с одного выстела)
var exclamation = 0;
var curr = 0;
while(curr < str.length)
{
if(str.charAt(curr) == "!") exclamation++;
curr++;
}

if(exclamation == N)
{
  for(key in x_values)
    x_values[key] = false;
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


//////////////////////////////////////////////////////////////////////////////////////////////////
var i = 0;

for(i = 0; i < arr.length; i++) //прогулка по массиву
  {
 var x_n = new Array();
 var stroke = arr[i];
 var b = 0;
 while (b < stroke.length) 
   {
      if (stroke.charAt(b) != "!")
        {
          var name = "x" + stroke.charAt(b);
          b++;
          var value = x_values[name];
          addEntry(x_n,name,value);
          
        }
      if (stroke.charAt(b) == "!")
        {
          b++;
          name = "x" + stroke.charAt(b);
          b++;
          value = !(x_values[name]);
          addEntry(x_n,name,value);        
        }
   }
     clauses.push(x_n);
  }
//x_values = {x1 : true, x2 : true, x3 : true, x4 : false, x5 : true};

 FindSolution(N,arr); //функция, выводящая решение в окно
}


function addEntry(arr, name, value) {
  arr.push({
    name: name,
    value: value
  });
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
     //if (mult == 0) break;
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
  var ribbon = Ribbon(N);
  var d=window.document.Form;
  var solves = Solve(arr); //проверка первичного набора
     

  var k = 1;
  while(k < ribbon.length)
    {
      if(solves == 1)
       {
         break;
       }
       
     var ch =  "x" + ribbon.charAt(k); //находим x в ленте, который мы будем менять
     while (ch in units)
     {
      k+=2;
      ch =  "x" + ribbon.charAt(k);
     }
     k+=2;

     //////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //x_values[x_num] = !x_values[x_num]; //меняем значение выбранного по ленте x
     //alert(x_values[x_num]);
     var empty_flag = 0;
     var has_current_x = 0;
      
      for (var i = 0; i < clauses.length;i++) //анализ клаузы на необходимость обязательного присваивания
        {
          var m = 0;
            while(m < clauses[i].length)
            {
            if (clauses[i][m].name != ch)
              {
                if (clauses[i][m].value == 1)
                  {
                    empty_flag = 1; //клауза не пустая
                  }
               }
                if (clauses[i][m].name == ch)
                   {
                     has_current_x = 1; 
                   }
               m++;
            }  
          if (has_current_x == 1 && empty_flag == 0) break;
          if (has_current_x == 0) empty_flag = 1;
        }
    
  if(empty_flag == 0) //действительно есть пустая клауза
   {
   for (var i = 0; i < clauses.length;i++)
    {
      var m = 0;
      while(m < clauses[i].length)
      {
      if (clauses[i][m].name == ch)
        {
       if (clauses[i][m].value == 0) //если текущая переменная - 0, значит, меняем её
         {
           clauses[i][m].value = !clauses[i][m].value;
           x_values[clauses[i][m].name] = !x_values[clauses[i][m].name];
           var solves = Solve(arr);
           if(solves == 1)
            {
             break;
            }
         }
        }
        m++;
        //если не != 0, то не меняем переменную
    }
   }
   }
     //////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
    }


d.textarea.value = "";      
if (solves == 1)
  {
    //alert("You find solution");
    var stroke_for_print = "";
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

/*
Exception: SyntaxError: missing } after function body
@Scratchpad/1:249
*/
/*
Exception: SyntaxError: expected expression, got '}'
@Scratchpad/1:95
*/
/*
Exception: SyntaxError: expected expression, got '}'
@Scratchpad/1:95
*/
/*
Exception: SyntaxError: expected expression, got '}'
@Scratchpad/1:237
*/
/*
Exception: SyntaxError: expected expression, got '}'
@Scratchpad/1:99
*/
/*
Exception: SyntaxError: unlabeled break must be inside loop or switch
onclick@file:///C:/Users/vrtmn/Desktop/DPLL/page1.html:1:1
*/
/*
Exception: SyntaxError: unlabeled break must be inside loop or switch
onclick@file:///C:/Users/vrtmn/Desktop/DPLL/page1.html:1:1
*/
/*
Exception: ReferenceError: invalid assignment left-hand side
onclick@file:///C:/Users/vrtmn/Desktop/DPLL/page1.html:1:1
*/