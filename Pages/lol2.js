let item_specifics={nothing:0, instrument:1, build:2};
let build_specifics={storage:1};
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
       	console.log(this.storage)
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
          return 1;
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
	constructor(new_map, new_players, new_players_names, new_builds)
	{
    this.map=new_map;
    this.players=new_players;
    this.names=new_players_names;
    this.builds=new_builds;
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
  if(x<0)
  {
    tx=world.map.length+x;
  }        
  if(y<0)
  {
    ty=world.map.length+y;
  }
  if(x>world.map.length-1)
  {
    tx=x%world.map.length;
  }
  if(y>world.map.length-1)
  {
    ty=y%world.map.length;
  }
  return [x, y, tx, ty];
}
let locate="main";
let use = new Image();
use.src="../Images/use.png"
canvas = document.getElementById("field");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth-10;
canvas.height = window.innerHeight-10;
// Анимации игрока
let anims =[new Image(), new Image(), new Image(), new Image()];
// Плитки
let tiles =[new Tile(1, 4, [], 10, 0, true), new Tile(0.4, 6, [], 1, 1), new Tile(1.1, 4, [], 12, 2)];
// Предметы
// num, item_name, specific, type
let items =[new Item(0, 'Nothing', [0], 0), new Item(1, 'Wood', [0], 0), 
              new Item(2, 'Wooden axe', [1, 2], 0), 
              new Item(3, "Wooden pickaxe", [1, 1], 1), new Item(4, "Stone", [0]),
              new Item(5,  'Table', [2, 4], 0), new Item(6, 'Stone axe', [1, 3], 0),
              new Item(7,'Stone pickaxe',[1, 2], 1), new Item(8, 'Chest', [2, 6], 0),
              new Item(9, 'Iron axe', [1, 4], 0), new Item(10, 'Iron pickaxe', [1, 3]),
              new Item(11, 'Golden axe', [1, 5], 0), new Item(12, 'Golden pickaxe', [1, 4], 1),
              new Item(13, 'Coal', [0], 0), new Item(14, 'Furnace', [2, 9], 0),
              new Item(15, 'Iron ore', [0], 0), new Item(16, 'Iron ingot', [0], 0),
              new Item(17, 'Anvil', [2, 10], 0), new Item(18, 'Shears', [1, 1], 7), 
              new Item(19, 'Flowduck', [2, 1], 0), new Item(20, 'Red berry', [3, 1]), 0]; 
let world=new World([], [], [], []);  
// Шляпы
let hats =[];
// Список номеров Builds объектов которые являются стенамм
let walls={11:true};
// Крафты
let crafts=[new Craft([[1, 10]], 0, [2, 1]), new Craft([[1, 10]], 0, [3, 1]), new Craft([[1, 15]], 0, [5, 1]), 
              new Craft([[2, 1],[1, 10],[4,5]], 4, [6,1]), new Craft([[3,1],[1,10],[4,5]], 4, [7,1]), new Craft([[1, 10]], 0, [8 ,1]),
              new Craft([[4, 10]], 4, [14, 1]), new Craft([[15, 1], [13, 1]], 9, [16, 1]), new Craft([[7, 1], [1, 20], [4, 10], [16, 5]], 10, [10, 1]),
              new Craft([[6, 1], [1, 20], [4, 10], [16, 5]], 10, [9, 1]), new Craft([[16, 10]], 4, [17, 1]),
              new Craft([[1, 4], [16, 2]], 4, [18, 1])];
// instrument, build_break, num, anims, x, y, drops, have_audio, min_pow, specifics
let builds=[0, new Build(7, 10, 1, 3, 0, 0, [[1, 19]], false, 0, [0]), new Build(1, 30, 2, 1, 0, 0, [[1, 4]], true, 0, [0]), new Build(0, 20, 3,1 , 0, 128, [[1, 1]], true, 0, [0]),
             new Build(0, 20, 4, 1, 0, 0, [[1, 5]], false, 0, [0]), new Build(7, 30, 5, 1,  0, 128, [[]], false, 0, [0]), new Build(0, 30, 6, 1, 0, 0, [[1, 8]], false, 0, [1, 10]),
             new Build(1, 40, 7, 1, 0, 0, [[1, 15]], true, 1, [0]), new Build(1, 40, 8, 1, 0, 0, [[1, 13]], false, 1, [0]),
             new Build(1, 50, 9, 1, 0, 0, [[1, 14]], false, 0, [0]), new Build(1, 100, 10, 1, 0, 0, [[1, 17]], true, 0, [0]), new Build(0, 20, 11, 1, 0, 0, [[1, 20]], false, 0, [0])];
  // Установка анимаций игрока
  for (var i = 0; i < 4; i++) 
  {
    anims[i].src='../Images/white'+i+'.png';
  }  
  // Установка шляп
  for (var i=0; i<8; i++)
  {
    hats[i]=[];
    for (var j=0; j<2; j++)
    {
      hats[i][j]=new Image();
      hats[i][j].src='../Images/hat'+i+''+j+'.png';
    }
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
    }}}
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
    if (window.event) {
        keyNum = window.event.keyCode;
        let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
        let tx=normalized[2];
        let player=world.players[myname];
        let ty=normalized[3];
        speed=world.players[myname].speed*tiles[world.map[normalized[2]][normalized[3]]].speed;

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
        else if(keyNum==69 && locate=='chest')
        {
          let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
          let tx=normalized[2];
          let player=world.players[myname];
          let ty=normalized[3];
          if(world.builds[tx][ty][0]!==0)
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
        else if(keyNum<58 && keyNum>47 && locate=='main')
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
        else if(keyNum==70 && locate=='main')
        { 
          let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));       
          let player=world.players[myname];         
          let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
          let tx=ts[2];
          let ty=ts[3];
          let x=ts[0];
          let y=ts[1];
          if(builds[world.builds[tx][ty][0]].storage)
          {
            locate='chest';
          }
        }
        else if(keyNum==70 && locate=='chest')
        {
          locate='main';
        }
    }
  }
  function cycle()
  {
    if(window.innerHeight!==canvas.height || window.innerWidth!==canvas.width)
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
    if(player.x<0)
    {
      player.x=world.map.length*128+player.x;
    }
    if(player.y<0 )
    {
      player.y=world.map.length*128+player.y;
    }
    if(player.y>world.map.length*128)
    {
      player.y=player.y-world.map.length*128;
    }
    if(player.x>world.map.length*128)
    {
      player.x=player.x-world.map.length*128;
    }
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
        }
      }
    }  
    player=world.players[myname];
    ctx.font='32px Arial';
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
    ctx.drawImage(use, canvas.width-128, canvas.height-128);
    if(locate=='chest' && builds[world.builds[tx][ty][0]].storage)
    {
      for (var i=0; i<builds[world.builds[tx][ty][0]].storage; i++)
      {
        ctx.strokeRect(i*32+len, canvas.height/2, 32, 32);
        ctx.font = "32px Arial";
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
  }
  function animations()
  {
    let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));       
    let player=world.players[myname];         
    let ts=normal(Math.round(player.x/128), Math.round(player.y/128));
    let tx=ts[2];
    let ty=ts[3];
    let x=ts[0];
    let y=ts[1];
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
          world.builds[tx][ty][2]=(world.builds[tx][ty][2]+1)&drawObject.images.length; 
        }
      }
    }  
 
  }
  function start()
  {
    ctx.fillText('СОЗДАНИЕ МИРА', canvas.width/2, canvas.height/2-64);
    myname=document.getElementById('name').value;
    world.names=[myname];
    let inventory=[[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0, 0]];
    if(myname=="ledinec")
    {
      inventory[0]=[1, 99];
      inventory[1]=[4, 99];
      inventory[2]=[15, 99];
      inventory[3]=[13, 99];
    }
    world.players[myname]=new Player(0, 0, 0, 0, inventory, 16, 1);
    let value=document.getElementById("size_pow").value;
    window.hat=document.getElementById('hat').value;
    document.getElementById('start').remove();
    world.map=[];
    world.builds=[];
    for (var i = 0; i < 2**value; i++)
    {
      world.map[i]=[];
      world.builds[i]=[100, 0, 0];
      for (var j = 0; j < 2**value;  j++)
      {
        world.builds[i][j]=[0,0];
        world.map[i][j]=0;
      }
    }
    let water=[];
    let size=2**value;
    for (var i = 0; i < size/16; i++) {
      water[water.length]=[random(size), random(size), random(80)+10];
    }
    let thing, pos;
    for (var i = 0; i < water.length; i++) {
      thing=water[i];
      pos=[thing[0], thing[1]];
      for (var i = 0; i < thing[2]; i++) {
        for (var j = 0; j < thing[2]; j++) {
          if(Math.sqrt(i**2+j**2)<100)
          {
            world.map[Math.abs(pos[0]+i)][Math.abs(pos[1]+j)]=1;
          }
        }    
      }
    }
    for(var i=0;i<size;i++)
    {
    	for(var j=0;j<size;j++)
    	{
    		if(world.map[i][j]==0)
    		{
    			if(Math.random()*100>60)
    			{
    				world.builds[i][j]=[3, builds[3].break, 0];
    			}
    		}
    	}
    }
    // console.log(water)
    document.getElementById('field').style.visibility='visible';
    document.getElementById('field').style.marginTop='0px';
    document.onkeydown = keyPress;
    document.onmousedown = mousedown;
    setInterval(cycle, 1);
    setInterval(animations, 100)
  }
