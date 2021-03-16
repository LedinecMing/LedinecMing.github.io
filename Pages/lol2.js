let item_specifics={nothing:0, instrument:1, build:2, food:3, weapon:4};
let build_specifics={storage:1, kust:2};
let keys={87:false, 83:false, 65:false, 68:false, 69:false, 70:false};
// gtihub.com/cgiffard/DiamondSquare give him a star! ^-^
(function(glob) {
  
  function DiamondSquare(data,width,height,roughness) {
    if (width * height !== data.length)
      throw Error("Data length mismatch.");
    
    this.dataStore  = data && data.length >= 4 ? data : [0,0,0,0];
    this.height   = height > 1 ? height : 2;
    this.width    = width > 1 ? width : 2;
    this.roughness  = roughness;
    this.iteration  = 1;
  }
  
  DiamondSquare.prototype.iterate = function() {
    var tmpDiamondingArray = [], finalArray = [], x, y,
      tmpXDoubledGrid = [], tmpDoubledGrid = [];
    
    // Double and interpolate the grid.
    
    // Double the width of each row
    for (var row = 0; row < this.height; row ++) {
      tmpXDoubledGrid.push(this.interpolateRow(row));
    }
    
    // Now add additional rows by interpolating vertically
    for (y = 0; y < tmpXDoubledGrid.length -1; y++) {
      tmpDoubledGrid.push(tmpXDoubledGrid[y]);
      tmpDoubledGrid.push(
        this.interpolateRowsVertically(
            tmpXDoubledGrid[y],
            tmpXDoubledGrid[y+1]));
    }
    
    // And add the last row back in...
    tmpDoubledGrid.push(tmpXDoubledGrid[tmpXDoubledGrid.length-1]);
    
    // Now comes the diamond part of the equation.
    // Calculate for roughness!
    for (y = 0; y < tmpDoubledGrid.length; y++) {
      if (y % 2) {
        var prevRow = tmpDoubledGrid[y-1],
          nextRow = tmpDoubledGrid[y-1],
          square = [];
        tmpDiamondingArray = tmpDoubledGrid[y];
        for (x = 0; x < tmpDiamondingArray.length; x++) {
          if (x % 2) {
            square = [
              prevRow[x],
              tmpDiamondingArray[x-1],
              tmpDiamondingArray[x+1],
              nextRow[x] ];
            
            var sqMax = Math.max.apply(Math,square),
              sqMin = Math.min.apply(Math,square),
              sqDif = sqMax - sqMin,
              interpolatedMedian = sqMin + sqDif/2;
            
            var rough = ((sqDif / this.iteration) * this.roughness) * (Math.random()-0.5),
              newHeight = interpolatedMedian + rough;
            
            tmpDiamondingArray[x] = newHeight;
          }
        }
        
        finalArray = finalArray.concat(tmpDiamondingArray);
      } else {
        finalArray = finalArray.concat(tmpDoubledGrid[y]);
      }
    }
    
    // Save our new width, height, and iteration
    this.width = (this.width*2) -1;
    this.height = (this.height*2) -1;
    this.iteration ++;
    
    this.dataStore = finalArray;
  };
  
  DiamondSquare.prototype.getSquare = function(x,y) {
    var cursor = (y * this.width) + x,
      firstRow = this.dataStore.slice(cursor,cursor+2),
      secondRow = this.dataStore.slice(cursor+this.width,cursor+this.width+2);
    
    return firstRow.concat(secondRow);
  };
  
  DiamondSquare.prototype.interpolateRow = function(y) {
    var cursor = 0, row = [], val1 = 0, val2 = 0;
    
    // Interpolate real row...
    for (x = 0; x < this.width - 1; x ++) {
      cursor = (y * this.width) + x;
      val1 = this.dataStore[cursor];
      val2 = this.dataStore[cursor+1];
      vali = this.interpolate(val1,val2);
      
      row.push(val1,vali);
      
      if (x === this.width-2) row.push(val2);
    }
    
    return row;
  };
  
  DiamondSquare.prototype.interpolateRowsVertically = function(r1,r2) {
    var mixRow = [];
    for (var rowPointer = 0; rowPointer < r1.length; rowPointer ++) {
      mixRow.push(this.interpolate(r1[rowPointer],r2[rowPointer]));
    }
    
    return mixRow;
  };
  
  DiamondSquare.prototype.interpolate = function(val1,val2) {
    var max = Math.max(val1,val2), min = Math.min(val1,val2),
      result = max !== min ? ((max-min)/2) + min : min;
    return !isNaN(result) ? result : min;
  };
  
  DiamondSquare.prototype.max = function() {
    return Math.max.apply(Math,this.dataStore);
  };
  
  DiamondSquare.prototype.min = function() {
    return Math.min.apply(Math,this.dataStore);
  };
  
  glob.DiamondSquare = DiamondSquare;
  
})(this);
class Point
{
  constructor(x, y, pos=false)
  {
    if(pos==false)
    {
      this.pos=[x, y];
    }
    else
    {
      this.pos=pos;
    }
  }
  rotate(angle)
  {
    angle=angle*3.14/180;
    let newX = Math.cos(angle)*this.pos[0]-Math.sin(angle)*this.pos[1];
    let newY = Math.sin(angle)*this.pos[0]+Math.cos(angle)*this.pos[1];
    this.pos=[newX, newY];
  }
  size(x, y)
  {
    this.pos=[this.pos[0]*x, this.pos[1]*y];
  }
  draw(x, y)
  {
    window.ctx.fillRect(this.pos[0]+x, this.pos[1]+y, 1, 1);
  }
}
class Vector
{
  constructor(p1, p2)
  {
    this.points=[p1, p2];
  }
  rotate(angle)
  {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].rotate(angle);
    }
  }
  size(x, y)
  {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].size(x, y); 
    }
  }
  draw(x, y)
  {
    ctx.beginPath();  
    ctx.moveTo(this.points[0].pos[0]+x, this.points[0].pos[1]+y); 
    ctx.lineTo(this.points[1].pos[0]+x, this.points[1].pos[1]+y);
    ctx.stroke();
  }
}
class Rect
{
  constructor(p1, w, h)
  {
    this.start=p1;
    this.vectors=[new Vector(new Point(0, 0), new Point(w, 0)), new Vector(new Point(w, 0), new Point(w, h)), new Vector(new Point(w, h), new Point(0, h)), new Vector(new Point(0, h), new Point(0, 0))];
  }
  draw(x, y)
  {
    for (var i = 0; i < this.vectors.length; i++) {
      this.vectors[i].draw(x+this.start.pos[0], y+this.start.pos[1]);
    }
  }
  rotate(angle)
  {
    for (var i = 0; i < this.vectors.length; i++) {
      this.vectors[i].rotate(angle);
    }   
  }
} 
class Item
{
  constructor(num, item_name, specific, type)
  {
    // Тип инструмента предмета
    this.type=type;
    // Сила инструмента
    this.pow=1;
    // Название предмета
    this.name=item_name;
    // Изображение по номеру
    this.image=new Image();
    this.image.src='../Images/items'+num+'.png'
    if(specific[0]==item_specifics.nothing)
    {
    
    }
    if(specific[0]==item_specifics.instrument)
    {
    		this.pow=specific[1];
    }
    if(specific[0]==item_specifics.build)
    {
    		this.building=specific[1];
    }
    if(specific[0]==item_specifics.food)
    {
        this.food=specific[1];
    }
    if(specific[0]==item_specifics.weapon)
    {
      this.weapon=specific[1];
    }
  }
}
class Build
  {
    constructor(instrument, build_break, num, anims, x, y, drops, have_audio, min_pow, specifics)
    {
      // Инструмент нужный для добычи
      this.instrument=instrument;
      // Прочность постройки
      this.break=build_break;
      this.images=[];
      // Добавляемые координаты при отрисовке
      this.x=x;
      this.y=y;
      // Кол-во анимаций 
      this.anims=anims;
      // Минимальная сила добывающего инструмента
      this.min_pow=min_pow;
      // Добыча
      this.drops=drops;
      // Установка анимаций
      for (var i = 0; i < anims; i++) {
        this.images[i]=new Image();
        this.images[i].src='../Images/builds'+num+''+i+'.png';
        console.log(this.images[i].src)
      }
      // Если have_audio - true задаем this.audio[1] как Audio объект, который проигрывается при добыче объекта
      this.audio=[false];
      if(have_audio===true)
      {
        console.log('../Music/build'+num+'.ogg')
        this.audio=[true, new Audio('../Music/build'+num+'.ogg')];
      }
      this.storage=false;
      if(specifics[0]==build_specifics.storage)
      { 	
       	this.storage=specifics[1];
      }
      else if(specifics[0]==build_specifics.kust)
      {
      	this.growtime=specifics[2];
      	this.grow=specifics[1];
      	this.grown=specifics[3];
      	this.last=specifics[4];
      	this.growDrop=specifics[5];
      }
    }
}
class Mob
{
  constructor(speed, hp, maxhp, anims, num, drop, x, y)
  {
    this.speed=speed;
    this.hp=hp;
    this.maxhp=maxhp;
    this.num=num;
    this.drop=drop;
    this.x=x;
    this.y=y;
    this.rotate=0;
    this.go=0;
    this.anim=0;
    this.anims=[];
    this.audio=new Audio('../Music/mob'+num+'0.ogg');
    for (var i = 0; i < anims; i++) 
    {
      this.anims[i]=new Image();
      this.anims[i].src='../Images/mob'+num+''+i+'.png';
    }
  }
  cycle()
  {
    if(Math.random()*100>90)
    {
      if(Math.random()*100>90)
      {
        if(Math.abs(distance([this.x, this.y], [world.players[myname].x, world.players[myname].y]))<canvas.width)
        {
          this.audio.volume=(canvas.width-(Math.abs(distance([this.x, this.y], [world.players[myname].x, world.players[myname].y]))))/canvas.width*0.5;
          this.audio.play();
          this.audio.volume=1;
        }
      }
    }
    if(this.go<1)
    {
      if(Math.random()*100>95) 
      {
        this.angle = random(360);
        this.go=random(30);
      }
    }
    else 
    {
      this.go-=1;
      let pos=[this.x, this.y];
      let p = new Point(this.speed, this.speed);
      p.rotate(this.angle);
      if(p.pos[0]>0)
      {
        this.rotate=0;
      }
      else
      {
        this.rotate=this.anims.length/2;
      }
      let normalized=normal(Math.floor(this.x/128), Math.floor(this.y/128));
      let coof=tiles[world.map[normalized[2]][normalized[3]]].speed;
      let normal2=normal(Math.floor((this.x+p.pos[0]*coof)/128), Math.floor((this.y+p.pos[1]*coof))/128);
      this.x+=p.pos[0]*coof;  //+pos[0];
      this.y+=p.pos[1]*coof; //+pos[1];
      this.anim++;
      this.x=(world.map.length*128+this.x)%(world.map.length*128);
      this.y=(world.map.length*128+this.y)%(world.map.length*128);
      let tile=world.map[Math.floor(this.x/128)][Math.floor(this.y/128)];
      if(tiles[tile].audio[0])
      {
        if(Math.abs(distance([this.x, this.y], [world.players[myname].x, world.players[myname].y]))<canvas.width)
        {
          tiles[tile].audio[1].volume=(canvas.width-(Math.abs(distance([this.x, this.y], [world.players[myname].x, world.players[myname].y]))))/canvas.width;
          tiles[tile].audio[1].play();
          tiles[tile].audio[1].volume=1;
        }
      }
    }
  }
}
class Player
{
  constructor(ange, aim, nx, ny, new_inventory, new_speed, new_hunger)
  {
    this.angle=ange;
    this.anim=aim;
    this.selected=0;
    this.x=nx
    this.y=ny;
    this.speed=new_speed;
    this.hunger=new_hunger;
    this.inventory=new_inventory;
  }
  add_item(item_num, nums)
  {
    let added=false;
    for( var i=0; i<this.inventory.length;i++)
    {
      if(this.inventory[i][1]<100-nums && this.inventory[i][0]==item_num )
      {
        this.inventory[i][0]=item_num;
        this.inventory[i][1]+=nums;
        added=true;
        return true;
      }
    }  
    for( var i=0; i<this.inventory.length;i++)
    {
      if(this.inventory[i][0]==0)
      {
        this.inventory[i][0]=item_num;
        this.inventory[i][1]+=nums;
        return true;
      }
    }
    return false;
  }
  remove_item(item_num, nums)
  {
    for (var i = 0; i< this.inventory.length; i++) {
      if(this.inventory[i][0]==item_num && this.inventory[i][1]+1>nums)
      {
        if(this.inventory[i][1]-nums==0)
        {
          this.inventory[i]=[0, 0];
          return true;
        }
        else
        {
          this.inventory[i][1]-=nums;
          return true;
        }
      }
    }
    return false;
  }
  can_remove(item_num, nums)
  {
    for (var i = 0; i< this.inventory.length; i++) {
      if(this.inventory[i][0]==item_num && this.inventory[i][1]+1>nums)
      {
        return true;
      }
    }
    return false;
  }
}
class World
{
	constructor(new_map, new_players, new_players_names, new_builds, new_mobs)
	{
    this.map=new_map;
    this.players=new_players;
    this.names=new_players_names;
    this.builds=new_builds;
    this.mobs=new_mobs;
  }
}
class Craft
{
  constructor(needs, place, result)
  {
    // Нужные предметы
    this.needs=needs;
    // Нужное рабочее место
    this.place=place;
    // Результат крафта
    this.result=result;
  }
  // Может ли игрок воспользоваться крафтом
  is_can(inventory, place, player)
  {
    for(var i=0;i<this.needs.length;i++)
    {
      if(player.can_remove(this.needs[i][0], this.needs[i][1]))
      {
        continue;
      }
      else
      {
        return false;
      }
    }
    if( place==this.place || this.place==0)
    {
      return true;
    }
  }
  // Скрафтить
  doCraft(player)
  {
    let normalized=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=normalized[2];
    let ty=normalized[3];
    if(this.is_can(player.inventory, world.builds[tx][ty][0], player))
    {
      for(var i=0; i<this.needs.length;i++)
      {
        player.remove_item(this.needs[i][0], this.needs[i][1]);
      }
    }
    else
    {
      return false;
    }
    player.add_item(this.result[0], this.result[1]);
  }
}
class Tile
{
  constructor(tile_speed, tile_instrument, tile_drops, tile_break, tile_num, have_audio)
  {
    // Коофициент умножения скорости игрока при прохождении через плитку
    this.speed=tile_speed;
    // Нужный для добычи инструмент, добычу плиток я еще не добавил
    this.instrument=tile_instrument;
    // Дроп плитки, добычу плиток я еще не добавил
    this.drops=tile_drops;
    // Прочность плитки, добычу плиток я еще не добавил
    this.break=tile_break;
    // Номер для отслеживания
    this.num=tile_num;
    this.image=new Image();
    this.image.src='../Images/tiles'+this.num+'.png';
    this.audio=[false];
    // Если have_audio - true, то this.audio[1] устанавливаем как Audio объект, проигрывается при прохождении через плитку    
    if(have_audio===true)
    {
      this.audio=[true, new Audio('../Music/tile'+tile_num+'.ogg')]
    }
  }
}
function genFile()
{
 



   



  const blob = new Blob([JSON.stringify({map:world.map})], {type : 'application/json'});
  return blob;
}
function downloadFile(file)
{
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "world.json";
  a.click();
}
function saveWorld()
{
  file=genFile();
  downloadFile(file);
}
function distance(a, b)
{
  // Дистанция между двумя точками
  return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
}
function modulo(a, b)
{
  // Негативный остаток от деления
  return (a%b+b)%b;
}
function normal(x, y)
{
  // Нормализация координат
  tx=x;
  ty=y;
  return [x, y, Math.floor(Math.abs(world.map.length+x)%world.map.length), Math.floor(Math.abs(world.map.length+y)%world.map.length)];}
let locate="main";
// Текстуры кнопок
let use = new Image();
use.src="../Images/use.png"
let pause= new Image();
pause.src='../Images/pause.png';
let download=new Image();
download.src='../Images/download.png';
// Холст и его настройки
canvas = document.getElementById("field");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Анимации игрока
let anims =[new Image(), new Image(), new Image(), new Image()];
// Плитки
let tiles =[new Tile(1, 4, [], 10, 0, true), new Tile(0.4, 6, [], 1, 1, true), new Tile(1.1, 4, [], 12, 2), new Tile(0.9, 4, [], 1, 3)];
// Предметы
// num, item_name, specific, type
let items =[new Item(0,  'Nothing', [0], 0), new Item(1, 'Wood', [0], 0), 
            new Item(2,  'Wooden axe', [1, 2], 0), new Item(3, "Wooden pickaxe", [1, 1], 1), 
            new Item(4,  "Stone", [0], 0), new Item(5, 'Table', [2, 4], 0),
            new Item(6,  'Stone axe', [1, 3], 0), new Item(7, 'Stone pickaxe',[1, 2], 1), 
            new Item(8,  'Chest', [2, 6], 0), new Item(9, 'Iron axe', [1, 4], 0), 
            new Item(10, 'Iron pickaxe', [1, 3], 1), new Item(11,'Golden axe', [1, 5], 0), 
            new Item(12, 'Golden pickaxe', [1, 4], 1), new Item(13,'Coal', [0], 0), 
            new Item(14, 'Furnace', [2, 9], 0), new Item(15,'Iron ore', [0], 0), 
            new Item(16, 'Iron ingot', [0], 0), new Item(17,'Anvil', [2, 10], 0), 
            new Item(18, 'Shears', [1, 1], 7), new Item(19,'Flowduck', [2, 1], 0), 
            new Item(20, 'Red berry', [3, 1], 0), new Item(21,'Berry bush', [2, 12], 0), 
            new Item(22, 'Stone shovel', [1, 1], 4), new Item(23,'Iron shovel', [1, 2], 4), 
            new Item(24, 'Kubok', [2, 13], 0), new Item(25,'Mushroom', [3, 2], 0), 
            new Item(26, 'Fried Mushroom', [3, 5], 0), new Item(27,'Campfire', [2, 16], 0), 
            new Item(28, 'Stone sword', [4, 1], 0), new Item(29,'Iron sword', [4, 2], 0), 
            new Item(30, 'Raw meat', [3, 3], 0), new Item(31,'Coocked meat', [3, 20], 0),
            new Item(32, 'Bread', [3, 10], 0), new Item(33, 'Wheat', [0], 0),
            new Item(34, 'Seed', [2, 17], 0)]; 
//speed, hp, anims, num, drop, x, y
let world=new World([], [], [], [], []);  
// Шляпы
let hats =[];
// Список номеров Tile объектов на которых нельзя строить
let walls={1:true};
// Крафты
let crafts=[new Craft([[1, 10]], 0, [2, 1]), new Craft([[1, 10]], 0, [3, 1]), new Craft([[1, 15]], 0, [5, 1]), 
            new Craft([[2, 1],[1, 10],[4,5]], 4, [6,1]), new Craft([[3,1],[1,10],[4,5]], 4, [7,1]), 
            new Craft([[1, 10]], 0, [8 ,1]), new Craft([[4, 10]], 4, [14, 1]), 
            new Craft([[15, 1], [13, 1]], 9, [16, 1]), new Craft([[7, 1], [1, 20], [4, 10], [16, 5]], 10, [10, 1]),
            new Craft([[6, 1], [1, 20], [4, 10], [16, 5]], 10, [9, 1]), new Craft([[16, 10]], 4, [17, 1]),
            new Craft([[1, 4], [16, 2]], 4, [18, 1]), new Craft([[1, 10], [4, 5]], 4, [22, 1]), 
            new Craft([[22, 1], [1, 15], [4, 10], [16, 5]], 10, [23, 1]), new Craft([[1, 4]], 9, [13, 1]),
            new Craft([[25, 4], [13, 1]], 9, [26, 4]), new Craft([[1, 10]], 0, [27, 1]),
            new Craft([[1, 4]], 16, [13, 1]), new Craft([[1, 2], [25, 1]], 16, [26, 1]),
            new Craft([[30, 1], [1, 2]], 16, [31, 1]), new Craft([[1, 10], [4, 5]], 4, [28, 1]),
            new Craft([[1, 15], [4, 10], [28, 1], [16, 5]], 10, [29, 1]), new Craft([[33, 3]], 9, [32, 1]),
            new Craft([[33, 1]], 0, [34, 1]), new Craft([[33, 3]], 10, [32, 1]), new Craft([[33, 3], [1, 2]], 16, [32, 1])];
// instrument, build_break, num, anims, x, y, drops, have_audio, min_pow, specifics
let builds=[0, 
             new Build(7, 10, 1, 3, 0, 0, [[1, 19]], false, 0, [0]), new Build(1, 30, 2, 1, 0, 0, [[1, 4]], true, 0, [0]), new Build(0, 20, 3,1 , 0, 128, [[1, 1]], true, 0, [0]),
             new Build(0, 20, 4, 1, 0, 0, [[1, 5]], false, 0, [0]), new Build(7, 30, 5, 1,  0, 128, [[]], false, 0, [0]), new Build(0, 30, 6, 1, 0, 0, [[1, 8]], false, 0, [1, 10]),
             new Build(1, 40, 7, 1, 0, 0, [[1, 15]], true, 1, [0]), new Build(1, 40, 8, 1, 0, 0, [[1, 13]], false, 1, [0]),
             new Build(1, 50, 9, 1, 0, 0, [[1, 14]], false, 0, [0]), new Build(1, 100, 10, 1, 0, 0, [[1, 17]], true, 0, [0]), 
             new Build(4, 20, 11, 1, 0, 0, [[1, 21], [2, 20]], false, 0, [2, 12, 0, true, 12, [[3, 20]]]), new Build(4, 20, 12, 1, 0, 0, [[1, 21]], false, 0, [2, 11, 600, false, 12]),
             new Build(1, 50, 13, 1, 0, 0, [[1, 24]], false, 0, [0]), new Build(0, 20, 14, 1, 0, 0, [[1, 25]], false, 0, [0]),
             new Build(0, 30, 15, 1, 0, 0, [[2, 13]], false, 0, [0]), new Build(0, 30, 16, 2, 0, 0, [[1, 13], [2, 1]], false, 0, [2, 15, 2400, false, 16]),
             new Build(0, 10, 17, 1, 0, 0, [[1, 34]], false, 0, [2, 18, 1200, false, 17]), new Build(0, 10, 18, 1, 0, 0, [[1, 34]], false, 0, [2, 19, 1200, false, 18]),
             new Build(0, 10, 19, 1, 0, 0, [[1, 32], [1, 33]], false, 0, [2, 19, 0, true, 17, [[1, 33]]])];
// Установка анимаций игрока
for (var i = 0; i < 4; i++) 
{
  anims[i].src='../Images/white'+i+'.png';
}  
// Установка шляп
for (var i=0; i<11; i++)
{
  hats[i]=[];
  for (var j=0; j<2; j++)
  {
    hats[i][j]=new Image();
    hats[i][j].src='../Images/hat'+i+''+j+'.png';
  }
}
let hunger=[];
for(var i=0; i<5; i++)
{
  hunger[i]=new Image();
  hunger[i].src='../Images/hunger'+i+'.png';
}
function random(n)
{
  // Функция рандома от 0 до n
  return Math.round(Math.random()*n)
}
function mousedown(e)
{
  // Обработка нажатий мышью
  let player=world.players[myname];
  let normalized=normal(Math.round(player.x/128), Math.round(player.y/128));
  let tx=normalized[2];
  let ty=normalized[3];
  // Обработка кнопки use
  if(e.clientX<canvas.width+1 && e.clientX>canvas.width-129 && e.clientY>canvas.height-128)
  {
    let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
    let tx=normalized[2];
    let player=world.players[myname];
    let ty=normalized[3];
    if(!items[player.inventory[player.selected][0]].building)
    {
      if(world.builds[tx][ty][0]>0 && builds[world.builds[tx][ty][0]].min_pow<items[player.inventory[player.selected][0]].pow)
      {
        if(builds[world.builds[tx][ty][0]].audio[0])
        {
          builds[world.builds[tx][ty][0]].audio[1].play();
        }
        if(world.builds[tx][ty][1]-items[player.inventory[player.selected][0]].pow<1 && world.builds[tx][ty][0]>0)
        {       
          let drop=builds[world.builds[tx][ty][0]].drops;
          for(var i=0;i<drop.length;i++)
          {
         	 player.add_item(drop[i][1], drop[i][0]);
           world.builds[tx][ty]=[0, 0, 0];  
          } 
        }
        else if(builds[world.builds[tx][ty][0]].instrument==items[player.inventory[player.selected][0]].type && items[player.inventory[player.selected][0]].pow>builds[world.builds[tx][ty][0]].min_pow) {
          world.builds[tx][ty][1]-=items[player.inventory[player.selected][0]].pow;
        }            
      }
    }
    else
    {
      let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
      let tx=normalized[2];
      let player=world.players[myname];
      let ty=normalized[3];
      if(world.builds[tx][ty][0]==0)
      {
        let storage=[];
        for (var i = 0; i < builds[items[player.inventory[player.selected][0]].building].storage; i++)
        {
          storage[i]=[0,0];
        }
        world.builds[tx][ty]=[items[player.inventory[player.selected][0]].building, builds[items[player.inventory[player.selected][0]].building].break, 0, storage];
        player.remove_item(player.inventory[player.selected][0], 1); 
      }
    }
  }
  if(e.clientX>canvas.width-129 && e.clientY<128)
  {
    if(locate=='pause')
    {
      locate='main';
      paused=false;
    }
    else
    {
      locate='pause'
      paused=true;
    }
  }
  if(paused)
  {
    if(e.clientX<("Коофициентдальностипрогрузки:"+render).length*32-320+32 && e.clientX>("Коофициентдальностипрогрузки:"+render).length*32-32*10 && e.clientY>64-32 && e.clientY<64-16)
    {
      render++;
    }
    else if(e.clientX<("Коофициентдальностипрогрузки:"+render).length*32-320+32 && e.clientX>("Коофициентдальностипрогрузки:"+render).length*32-32*10 && e.clientY>64 && e.clientY<64+16)
    {
        if(render-1<1)
        {
          return;
        }
        render--;
    }
    else if(e.clientX<('Установить мир:'+render).length*32-160 && e.clientX>('Установить мир:'+render).length*32-160-33)
    {
      alert('Может залагать...');
      downloadFile(genFile());
    }
  }
  j=0;
  let c=[];
  for(var i=0; i<crafts.length;i++)
  {
    if(crafts[i].is_can(player.inventory, world.builds[tx][ty][0], player))
    {
      c[j]=crafts[i];
      j++;
    }
  }      
  if(e.clientX<c.length*32 && e.clientY<33 && locate=='main')
  {
    c[Math.floor(e.clientX/32)].doCraft(world.players[myname]);
  }
  let len=32*player.inventory.length;
  len=canvas.width/2-len/2;
  if(e.clientX>len && e.clientX<canvas.width-len+1 && e.clientY>canvas.height-32)
  {
    let num=(e.clientX-len)/32;
    world.players[myname].selected=Math.floor(num);
  }
}
function wheelUse(e) 
{

}
function keyPress(e) 
{
  let keyNum;
  if (window.event) 
  {
    keyNum = window.event.keyCode;
    if(keyNum in keys)
    {
      keys[keyNum]=true;
      return;
    }
    let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
    let tx=normalized[2];
    let player=world.players[myname];
    let ty=normalized[3];
    if(keyNum==27)
    {
      paused=!paused;
      if(locate=='main')
      {
        locate='pause'
      }
      else
      {
        locate='main'
      }
    }
    if(paused)
    {
      return;
    }
    if(keyNum<58 && keyNum>47 && locate=='main')
    {
      let digit=keyNum%48-1;
      if(digit<0)
      {
        digit=9;
      }
      world.players[myname].selected=digit;
    }
    else if(keyNum<58 && keyNum>47 && locate=='chest')
    {
      let digit=keyNum%48-1;
      if(world.builds[tx][ty][3])
      {
        if(digit<0)
        {
          digit=world.builds[tx][ty][3].length-1;
        }
        world.players[myname].selected=digit;
      }
    }
  }
}  
function execKey(keyNum)
{
  if (paused) 
  {
    return;
  }
  let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
  let tx=normalized[2];
  let player=world.players[myname];
  let ty=normalized[3];
  speed=world.players[myname].speed*tiles[world.map[normalized[2]][normalized[3]]].speed;
  if(locate=='chest')
  {
    if(!builds[world.builds[tx][ty][0]].storage)
    {
      locate='main';
    }
  }
  if(keyNum==87)
  {
    world.players[myname].y-=speed;
    world.players[myname].anim+=1;
    let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=ts[2];
    let ty=ts[3];
    let x=ts[0];
    let y=ts[1];
    if(tiles[world.map[tx][ty]].audio[0])
    {
      tiles[world.map[tx][ty]].audio[1].play();
    }
  }
  else if(keyNum==83)
  {
    world.players[myname].y+=speed;
    world.players[myname].anim+=1;          
    let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=ts[2];
    let ty=ts[3];
    let x=ts[0];
    let y=ts[1];
    if(tiles[world.map[tx][ty]].audio[0])
    {
      tiles[world.map[tx][ty]].audio[1].play();
    }
  }
  else if(keyNum==65)
  {
    world.players[myname].x-=speed;
    world.players[myname].anim+=1;
    world.players[myname].angle=0;          
    let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=ts[2];
    let ty=ts[3];
    let x=ts[0];
    let y=ts[1];
    if(tiles[world.map[tx][ty]].audio[0])
    {
      tiles[world.map[tx][ty]].audio[1].play();
    }
  }
  else if(keyNum==68)
  {
    world.players[myname].x+=speed;
    world.players[myname].anim+=1;
    world.players[myname].angle=2;          
    let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=ts[2];
    let ty=ts[3];
    let x=ts[0];
    let y=ts[1];
    if(tiles[world.map[tx][ty]].audio[0])
    {
      tiles[world.map[tx][ty]].audio[1].play();
    }
  }
  else if(keyNum==69 && locate=='main')
  {
    let player=world.players[myname];
    if(items[player.inventory[player.selected][0]].food)
    {
      if(player.hunger+items[player.inventory[player.selected][0]].food<100)
      {
        world.players[myname].hunger+=items[player.inventory[player.selected][0]].food;
        world.players[myname].remove_item(player.inventory[player.selected][0], 1);
        return true;
      }
    }
    else if(items[player.inventory[player.selected][0]].weapon)
    {
      for (var i = 0; i < world.mobs.length; i++) 
      {
        let mob_coords=normal(Math.round(world.mobs[i].x/128), Math.round(world.mobs[i].y/128));
        let player_coords=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
        if(mob_coords[0]==player_coords[0] && mob_coords[1]==player_coords[1])
        {
          if(world.mobs[i].hp-items[player.inventory[player.selected][0]].weapon<0)
          {
            for (var j = 0; j < world.mobs[i].drop.length; j++) 
            {
              player.add_item(world.mobs[i].drop[j][0],world.mobs[i].drop[j][1]);
            }
            world.mobs[i]=new Mob(world.mobs[i].speed, world.mobs[i].maxhp, world.mobs[i].maxhp, world.mobs[i].anims, world.mobs[i].num, world.mobs[i].drop, random(world.map.length)*128, random(world.map.length)*128);
            if(!world.mobs[i].go)
            {
              world.mobs[i].go=random(50);
              world.angle=random(360);
            }
            return;
          }
          world.mobs[i].hp-=items[player.inventory[player.selected][0]].weapon;
          return;
        }
      }
    }
    let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
    let tx=normalized[2];
    let ty=normalized[3];
    if(!items[player.inventory[player.selected][0]].building)
    {
      if(world.builds[tx][ty][0]>0 && builds[world.builds[tx][ty][0]].min_pow<items[player.inventory[player.selected][0]].pow)
      {
        if(world.builds[tx][ty][1]-items[player.inventory[player.selected][0]].pow<1 && world.builds[tx][ty][0]>0)
        {       
          let drop=builds[world.builds[tx][ty][0]].drops;
          for(var i=0;i<drop.length;i++)
          {
            player.add_item(drop[i][1], drop[i][0]);
            world.builds[tx][ty]=[0, 0, 0];  
          } 
        }
        else if(builds[world.builds[tx][ty][0]].instrument==items[player.inventory[player.selected][0]].type && items[player.inventory[player.selected][0]].pow>builds[world.builds[tx][ty][0]].min_pow) 
        {
          world.builds[tx][ty][1]-=items[player.inventory[player.selected][0]].pow;
          if(builds[world.builds[tx][ty][0]].audio[0])
          {
            builds[world.builds[tx][ty][0]].audio[1].play();
          }
        }            
      }
    }
    else
    {
      let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
      let tx=normalized[2];
      let player=world.players[myname];
      let ty=normalized[3];
      if(world.builds[tx][ty][0]==0 && !(world.map[tx][ty] in walls))
      {
        let storage=[];
        for (var i = 0; i < builds[items[player.inventory[player.selected][0]].building].storage; i++)
        {
          storage[i]=[0,0];
        }
        world.builds[tx][ty]=[items[player.inventory[player.selected][0]].building, builds[items[player.inventory[player.selected][0]].building].break, 0, storage];
        player.remove_item(player.inventory[player.selected][0], 1); 
      }
    }
  }
  else if(keyNum==69 && locate=='chest')
  {
    let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
    let tx=normalized[2];
    let player=world.players[myname];
    let ty=normalized[3];
    if(world.builds[tx][ty][0]!==0 && world.builds[tx][ty][3].length)
    {
      if(world.builds[tx][ty][3][player.selected][0]!==0)
      {
        if(player.add_item(world.builds[tx][ty][3][player.selected][0], world.builds[tx][ty][3][player.selected][1]))
        {
          world.builds[tx][ty][3][player.selected]=[0, 0];
        } 
      }
      else
      {
        if(player.inventory[player.selected][0]!==0)
        {
          world.builds[tx][ty][3][player.selected]=[player.inventory[player.selected][0], player.inventory[player.selected][1]];
          player.remove_item(player.inventory[player.selected][0], player.inventory[player.selected][1]);
        }
      }
    }
  }
  
  else if(keyNum==70 && locate=='main')
  { 
    let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));       
    let player=world.players[myname];         
    let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=ts[2];
    let ty=ts[3];
    let x=ts[0];
    let y=ts[1];
    let build=builds[world.builds[tx][ty][0]];
    if(build.storage)
    {
      locate='chest';
    }
    else if(build.grown)
    {
      for(var i=0;i<build.growDrop.length;i++)
      {
        world.players[myname].add_item(build.growDrop[i][1],build.growDrop[i][0]);
        world.builds[tx][ty]=[build.last, builds[build.last].break,0];
      }
    }
  }
}
function keyUnpress(e)
{
  let keyNum;
  if (window.event) 
  {
    keyNum = window.event.keyCode;
    if(keyNum in keys)
    {
      keys[keyNum]=false;
      return;
    }
  }
}
function keyCycle()
{
  let keylist=[87, 83, 65, 68, 69, 70];
  for (var i = 0; i < keylist.length; i++) {
    if(keys[keylist[i]])
    {
      execKey(keylist[i]);
    }
  }
}
function getHash(str)
{
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      var character = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+character;
      hash = hash & hash; // Convert to 32bit integer
  }  
  return hash;
}
function cycle()
{
  if(window.innerHeight-10!==canvas.height || window.innerWidth-10!==canvas.width)
  {
    canvas.height=window.innerHeight-10;
    canvas.width=window.innerWidth-10;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));       
  let player=world.players[myname];         
  let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
  let tx=ts[2];
  let ty=ts[3];
  let x=ts[0];
  let y=ts[1];
  world.players[myname].x=(world.map.length*128+world.players[myname].x)%(world.map.length*128);
  world.players[myname].y=(world.map.length*128+world.players[myname].y)%(world.map.length*128);
  for (var i = Math.round(player.x/128-canvas.width/128-1); i <= Math.round(player.x/128+canvas.width/128-1); i++)
  {
    for (var j = Math.round(player.y/128-canvas.height/128+1); j <= Math.round(player.y/128+canvas.height/128+1); j++) 
    {
      let ts=normal(i, j);
      let tx=ts[2];
      let ty=ts[3];
      let x=ts[0];
      let y=ts[1];
      ctx.drawImage(tiles[world.map[tx][ty]].image, x*128+canvas.width/2-player.x, y*128+canvas.height/2-world.players[myname].y);
    }
  }   
  for (var i = Math.round(player.x/128-canvas.width/128-1); i <= Math.round(player.x/128+canvas.width/128-1); i++)
  {
    for (var j = Math.round(player.y/128-canvas.height/128-1); j <= Math.round(player.y/128+canvas.height/128+1); j++) 
    {
      let ts=normal(i, j);
      let tx=ts[2];
      let ty=ts[3];
      let x=ts[0];
      let y=ts[1];
      if(world.builds[tx][ty][0]>0)
      {
        let drawObject=builds[world.builds[tx][ty][0]];
        ctx.drawImage(drawObject.images[world.builds[tx][ty][2]%drawObject.images.length], x*128+canvas.width/2-world.players[myname].x, y*128+canvas.height/2-world.players[myname].y-drawObject.y); 
        if(world.builds[tx][ty][0]==13)
        {
          ctx.textAlign='center';
          ctx.font = "16px monospace";
          ctx.fillStyle='yellow';
          const cool_people={874305450:'Kovirum', 1427080407:'Edited cocktail', 479681963:'Drfiy', 667273765:'ЧайныйЧай', 794427940:'Frosty', 1926171922:'Faradey Stream'};
          ctx.fillText(cool_people[code], x*128+canvas.width/2-world.players[myname].x+64, y*128+canvas.height/2-world.players[myname].y);
        }
      }
    }
  } 
  for (var i = 0; i < world.mobs.length; i++) 
  {
    if(world.mobs[i].x-world.players[myname].x+canvas.width/2>-129 && world.mobs[i].x-world.players[myname].x+canvas.width/2<canvas.width+128 )
    {
      if(world.mobs[i].y-world.players[myname].y+canvas.height/2>-129 && world.mobs[i].y-world.players[myname].y+canvas.height/2<canvas.height+128 )
      {
        ctx.drawImage(world.mobs[i].anims[Math.floor(world.mobs[i].anim%world.mobs[i].anims.length/2+world.mobs[i].rotate)], world.mobs[i].x-world.players[myname].x+canvas.width/2, world.mobs[i].y-world.players[myname].y+canvas.height/2);
        ctx.fillStyle='rgb('+Math.round(255-world.mobs[i].maxhp/world.mobs[i].hp*255)+', '+Math.round(world.mobs[i].maxhp/world.mobs[i].hp*255)+', 0)';
        ctx.fillRect(world.mobs[i].x-world.players[myname].x+canvas.width/2, world.mobs[i].y-world.players[myname].y+canvas.height/2-10, 128, 10)
      }  
    }
  }

  ctx.fillStyle='black';  
  player=world.players[myname];
  ctx.font='16px Arial';
  ctx.textAlign='center';
  ctx.fillText(myname ,canvas.width/2+64 ,canvas.height/2-10);
  ctx.drawImage(anims[player.anim%2+player.angle], canvas.width/2, canvas.height/2);
  let d=0;
  if(player.angle==2)
  {
    d=1;
  }
  ctx.drawImage(hats[hat][d], canvas.width/2, canvas.height/2-5*(world.players[myname].anim%2));
  if(player.inventory[player.selected][0]!==0)
  {
    ctx.drawImage(items[player.inventory[player.selected][0]].image, canvas.width/2+16+(20*player.angle), canvas.height/2+64);
  }
  let len=32*player.inventory.length;
  len=canvas.width/2-len/2;
  for (var i=0; i<player.inventory.length; i++)
  {
    ctx.strokeRect(i*32+len, canvas.height-32, 32, 32);
    ctx.font = "32px Arial";
    ctx.textAlign='center';
    if( i==player.selected )
    {
      ctx.fillRect(i*32+5+len, canvas.height-27, 22, 22);
    }
    if(world.players[myname].inventory[i][0]!=0)
    {
      ctx.drawImage(items[world.players[myname].inventory[i][0]].image, i*32+len, canvas.height-32);
      ctx.fillText(''+world.players[myname].inventory[i][1]+'', i*32+16+len, canvas.height-32);
    }
  }
  ctx.textAlign='center';
  if(world.builds[tx][ty][0]!==0)
  {
    ctx.fillText(world.builds[tx][ty][1]+'/'+builds[world.builds[tx][ty][0]].break, canvas.width/2+64, canvas.height/2+128);
  }
  if(locate=='main')
  {
    let j=0;
    for(var i=0; i<crafts.length;i++)
    {
      if(crafts[i].is_can(player.inventory, world.builds[tx][ty][0], player))
      {
        ctx.strokeRect(j*32, 0, 32, 32);
        ctx.drawImage(items[crafts[i].result[0]].image, j*32, 0);
        j++;
      }
    }
  }  
  if(locate=='chest' && builds[world.builds[tx][ty][0]].storage)
  {
    for (var i=0; i<builds[world.builds[tx][ty][0]].storage; i++)
    {
      ctx.strokeRect(i*32+len, canvas.height/2, 32, 32);
      ctx.font = "8px Arial";
      ctx.textAlign='center';
      if( i==player.selected )
      {
        ctx.fillRect(i*32+5+len, canvas.height/2, 22, 22);
      }
      if(world.builds[tx][ty][3][i][0]!==0)
      {
        ctx.drawImage(items[world.builds[tx][ty][3][i][0]].image, i*32+len, canvas.height/2);
        ctx.fillText(''+world.builds[tx][ty][3][i][1]+'', i*32+16+len, canvas.height/2);
      }
    }
  }
  if(paused)
  {
    ctx.textAlign='left';
    ctx.font='32px monospace';
    ctx.fillStyle='rgb(128, 118, 121)';
    ctx.fillRect(32, 32, canvas.width-48, canvas.height-48);
    ctx.fillStyle='black';
    ctx.fillText("Коэфициент дальности прогрузки: "+render, 64, 64);
    ctx.fillText('+', ("Коофициентдальностипрогрузки:"+render).length*32-320, 64-16);
    ctx.fillText('-', ("Коофициентдальностипрогрузки:"+render).length*32-320, 64+16);
    ctx.fillText('Установить мир', 64, 64+32);
    ctx.drawImage(download, ('Установить мир:'+render).length*32-160-32, 64);
  }
  else
  {
    ctx.drawImage(use, canvas.width-128, canvas.height-128);
    ctx.fillStyle='rgb('+(255-world.players[myname].hunger/99*255)+','+(Math.round(world.players[myname].hunger/99*255))+',0)';
    ctx.fillRect(len-64, canvas.height-Math.round(64*(world.players[myname].hunger/99)), 64, 64);
    ctx.drawImage(hunger[Math.floor(world.players[myname].hunger/20)], len-64, canvas.height-64);
    ctx.font="32px Arial";
    ctx.fillStyle='black';
    ctx.fillText(tx+'/'+ty, canvas.width-64, 128+16);
  }
  ctx.drawImage(pause, canvas.width-128, 0);
} 
function animations()
{
  if(paused)
  {
    return;
  }
  let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));       
  let player=world.players[myname];         
  let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
  let tx=ts[2];
  let ty=ts[3];
  let x=ts[0];
  let y=ts[1];
  for (var i = Math.round(player.x/128-canvas.width/128*render-1); i <= Math.round(player.x/128+canvas.width/128*render-1); i++)
  {
    for (var j = Math.round(player.y/128-canvas.height/128*render-1); j <= Math.round(player.y/128+canvas.height/128*render+1); j++) 
    {
      let ts=normal(i, j);
      let tx=ts[2];
      let ty=ts[3];
      let x=ts[0];
      let y=ts[1];
      let build=world.builds[tx][ty];
      if(build[0]>0)
      {
        let drawObject=builds[build[0]];
        if(!drawObject.growtime)
        {
       			world.builds[tx][ty][2]=(build[2]+1)%drawObject.images.length; 
        }
        else if(!builds[build[0]].grown)
        {
      	  	world.builds[tx][ty][2]+=1;
        		if(world.builds[tx][ty][2]>builds[build[0]].growtime)
        		{
        			world.builds[tx][ty]=[builds[build[0]].grow, builds[builds[build[0]].grow].break, 0];
        		}
        }
      }
    }
  }
  for (var i = 0; i < world.mobs.length; i++) 
  {
    if(world.mobs[i].x-world.players[myname].x+canvas.width/2*render>-129 && world.mobs[i].x-world.players[myname].x+canvas.width/2<canvas.width*render+129 )
    {
      if(world.mobs[i].y-world.players[myname].y+canvas.height/2*render>-129 && world.mobs[i].y-world.players[myname].y+canvas.height/2<canvas.height*render+129 )
      {
        world.mobs[i].cycle();        
      }
    }
  }  
}
function fhunger() 
{
  if(paused)
  {
    return;
  }
  world.players[myname].hunger-=1;
  if(world.players[myname].hunger<0)
  {
    start(1);
  }
}
function start(arg)
{
  render=1;
  if(!arg)
  {
    code=getHash(document.getElementById('code').value);
    document.getElementById('field').style.visibility='visible';
    document.getElementById('field').style.marginTop='0px';
    document.getElementById('content').style.margin='0px';
    myname=document.getElementById('name').value;
    value=document.getElementById("size_pow").value;
    window.hat=document.getElementById('hat').value;
    document.getElementById('start').remove();
  }
  paused=false;
  ctx.fillText('СОЗДАНИЕ МИРА', canvas.width/2, canvas.height/2-64);
  world.names=[myname];
  let inventory=[[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0, 0]];
  let speed=16;
  if(code in {874305450:'Kovirum', 1427080407:'Edited cocktail', 479681963:'Drfiy', 667273765:'ЧайныйЧай', 794427940:'Frosty', 1926171922:'Ivan Pevko'})
  {
    inventory[0]=[24, 1];
  }
  world.players[myname]=new Player(0, 0, 0, 0, inventory, speed, 99);
  world.map=[];
  world.builds=[];
  var myInitMap = [0,7,-3,6,
  1,7,2,5,
  0,1,3,-1,
  8,5,3,0];
  for (var i = 0; i < 16; i++) 
  {
    myInitMap[i]=Math.round(Math.random()*10)-4;
  }
  // Create a new DiamondSquare algorithm from the initial map, with a random
  // roughness factor
  var ds = new DiamondSquare(myInitMap, 4,4 , 10);
  
  
  // Iterate until you're satisfied. The map doubles in size with each
  // iteration.
  for (var i = 0; i < value; i++) {
    ds.iterate();
    ds.interpolate();
  }
  
  // Then the data you want is in:
  size=Math.sqrt(ds.dataStore.length);
  for(var i=0; i<size;i++)
  {
    world.map[i]=[];
    for (var j = 0; j < size; j++) 
    {
      if(ds.dataStore[i*size+j]<1)
      {
        world.map[i][j]=1;
      }
      if(ds.dataStore[i*size+j]>0 && ds.dataStore[i*size+j]<6  && ds.dataStore[i*size+j]!=3)
      {
        world.map[i][j]=0;
      }
      else if( ds.dataStore[i*size+j]==3)
      {
        world.map[i][j]=2;
      }
      if(ds.dataStore[i*size+j]>5)
      {
        world.map[i][j]=3;
      }
    }
  }

  for (var i = 0; i < size; i++)
  {
    world.builds[i]=[100, 0, 0];
    for (var j = 0; j < size;  j++)
    {
      world.builds[i][j]=[0,0];
    }
  }
  // function gen(tile, min, max, rarity)
  // {
  //   let water=[];
  //   for (var i = 1; i < size/rarity; i++) {
  //     water[i]=[random(size), random(size), random(max-min)+min];
  //   }
  //   let thing, pos, setx, sety;
  //   for (var i = 0; i < water.length-1; i++) {
  //     thing=water[i];
  //     if(thing===undefined)
  //     {
  //     	continue;
  //     }
  //     pos=[thing[0], thing[1]];
  //     for (var i = -thing[2]/2; i < thing[2]/2; i++) {
  //       for (var j = -thing[2]/2; j < thing[2]/2; j++) {
  //         if((i)**2+(j)**2<(thing[2]/2)**2)
  //         {
  //           setx=Math.floor(Math.abs(size+pos[0]+i)%size);
  //           sety=Math.floor(Math.abs(size+pos[1]+j)%size);
  //           world.map[setx][sety]=tile;
  //         }
  //       }    
  //     }
  //   }
  // }
  // gen(1, 10, 90, 1, size);
  // gen(3, 40, 70, 2, size);
  // gen(2, 40, 100, 4, size);
  // let w=0;
  for(var i=0;i<size;i++)
  {
  	for(var j=0;j<size;j++)
  	{
  		if(world.map[i][j]==0)
      {
        if(Math.random()*100>90)
        {
          world.builds[i][j]=[17, 10, 0];
        }
  			if(Math.random()*100>60)
  			{
  				world.builds[i][j]=[3, builds[3].break, 0];
  			}
  			if(Math.random()*100>90)
  			{
  				world.map[i][j]=2;
  				if(Math.random()*100>50)
  				{
  					world.builds[i][j]=[1, builds[1].break, 0];
  				}
  			}
        else if(Math.random()*100>93)
        {
          world.builds[i][j]=[14, builds[14].break, 0];
        }
  			else if(Math.random()*100>95)
  			{
  				 if(Math.random()*100>50)
  				 {
  				 	 world.builds[i][j]=[2, builds[2].break, 0];
  				 }
  				 else if(Math.random()*100>60)
  				 {
  				 	 world.builds[i][j]=[7, builds[7].break, 0];
  				 }
  				 else
  				 {
  				 	world.builds[i][j]=[8, builds[8].break, 0];
  				 }
  			}
        if(Math.random()*100==1)
        {
          if(Math.random()*100>60)
          {
            world.builds[i][j]=[11, builds[11].break, 0];
          }
        }
  		}
  		if(world.map[i][j]==3)
  		{
  			if(Math.random()*100>50)
  		  {
  			  world.builds[i][j]=[2, builds[2].break, 0];
  			}
  			else if(Math.random()*100>60)
  			{
  				world.builds[i][j]=[7, builds[7].break, 0];
  			}
  			else
  			{
  				world.builds[i][j]=[8, builds[8].break, 0];
  			}
  		}
      else if(world.map[i][j]==2)
      {
        if(Math.random()*100>90)
        {
          world.builds[i][j]=[3, builds[3].break, 0];
        }
        if(Math.random()*100>90)
        {
          world.builds[i][j]=[1, builds[1].break, 0];
        }
        else if(Math.random()*100>90)
        {
          if(Math.random()*100>50)
          {
            world.builds[i][j]=[11, builds[11].break, 0];
          }
        }
      }
  	}
  }
  for (var i = 0; i < size*2; i++) {
    let x, y;
    x=random(size);
    y=random(size);
    normalized=normal(x, y);
    x=normalized[2];
    y=normalized[3];
    if(world.map[x][y]!==1)
    {
      world.mobs[world.mobs.length]=new Mob(8, 10, 10, 6, 0, [[30, Math.round(Math.random())+1]], random(size)*128, random(size)*128);
    }
  }
  document.onkeydown = keyPress;
  document.onkeyup = keyUnpress;
  document.onmousedown = mousedown;
  setInterval(cycle, 1);
  setInterval(animations, 100);
  setInterval(fhunger, 5000);
  setInterval(keyCycle, 100);
  canvas.height=window.innerHeight;
  canvas.width=window.innerWidth;
}
