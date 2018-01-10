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

  //сначала находим переменные функции, делаем под них словарик и производим подсчёт N
  
  var i = 0;
  while(i < str.length)
  {
    if (str.charAt(i) == "x")
    {
    i++;
    x_values["x"+str.charAt(i)] = true;
    }
    i++;
  }
  
  var N = 0; 
  
  for(key in x_values) //посчитали количество участвующих переменных
  {
   N++;
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
}



function FindSolution(N, arr)
{
  var solves = Solve(arr);
  var ribbon = Ribbon(N);
  var d=window.document.Form;

  var k = 1;
  while(k < ribbon.length)
    {
      
     var ch =  "x" + ribbon.charAt(k); //находим x в ленте, который мы будем менять
     k+=2;
     //////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //x_values[x_num] = !x_values[x_num]; //меняем значение выбранного по ленте x
     //alert(x_values[x_num]);
     var empty_flag = 1;
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
                    empty_flag = 0; //клауза не пустая
                  }
               }
                if (clauses[i][m].name == ch)
                   {
                     has_current_x = 1; 
                   }
               m++;
            }  
          if (has_current_x = 0) empty_flag = 1; //делаем проверку, что в пустой клаузе есть наш х
        }
    
  if(empty_flag = 0) //действительно есть пустая клауза
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
         }
        }
        //если не != 0, то не меняем переменную
    }
   }
   }
   
  if(empty_flag = 1) //если же клауза не обращается в ноль, можно менять спокойно
     {
       x_values[ch] = !x_values[ch];
    }
      
     //////////////////////////////////////////////////////////////////////////////////////////////////////////////
     solves = Solve(arr);
     if(solves == 1)
       {
         break;
       }
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