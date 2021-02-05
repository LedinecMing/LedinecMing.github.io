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
      let shtula=false;

      for( var i=0; i<this.inventory.length;i++)
      {
        if(this.inventory[i][1]<100-nums && this.inventory[i][0]==item_num )
        {
          this.inventory[i][0]=item_num;
          this.inventory[i][1]+=nums;
          shtula=true;
          return 1;
        }
      }
      
      for( var i=0; i<this.inventory.length;i++)
        {
          if(this.inventory[i][0]==0)
          {
            this.inventory[i][0]=item_num;
            this.inventory[i][1]+=nums;
            return 1;
          }
        }
      
      return 0;
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
  class Build
  {
    constructor(instrument ,build_break, num, anims, x, y, drops)
    {
      this.instrument=instrument;
      this.break=build_break;
      this.images=[];
      this.x=x;
      this.anims=anims;
      this.y=y;
      this.drops=drops;
      for (var i = 0; i < anims; i++) {
        this.images[i]=new Image();
        this.images[i].src='../Images/builds'+num+''+i+'.png';
      }
    }
  }
  class Item
  {
    constructor(type, is_instrument, power, breaking, num, item_name)
    {
      this.type=type;
      this.instrument=is_instrument;
      this.break;
      this.pow=power;
      this.name=item_name;
      this.image=new Image();
      this.image.src='../Images/items'+num+'.png'
    }
  }
  class Craft
  {
    constructor(needs, place, result)
    {
      this.needs=needs;
      this.place=place;
      this.result=result;
    }
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
    doCraft(player)
    {
      let normalized=normal(Math.round(player.x/128), Math.round(player.y/128));
      let tx=normalized[2];
      let ty=normalized[3];
      if(this.is_can(player.inventory, world.map[tx][ty], player))
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
    constructor(tile_speed, tile_instrument, tile_drops, tile_break, tile_num)
    {
      this.speed=tile_speed;
      this.instrument=tile_instrument;
      this.drops=tile_drops;
      this.break=tile_break;
      this.num=tile_num;
      this.image=new Image();
      this.image.src='../Images/tiles'+this.num+'.png';
    }
  }
  function distance(a, b)
  {
    return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
  }
  function modulo(a, b)
  {
    return (a%b+b)%b;
  }
  function normal(x, y)
  {
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
  console_log=false;
  speed=16;
  canvas = document.getElementById("field");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth-10;
  canvas.height = window.innerHeight-10;
  let anims =[new Image(), new Image(), new Image(), new Image()];
  let tiles =[new Tile(1, 4, [], 10, 0), new Tile(0.4, 6, [], 1, 1), new Tile(1.1, 4, [], 12, 2)];
  let items =[new Item(0, false, 1, 0, 0, ""), new Item(0, false, 1, 0, 1, 'Wood'), new Item(0, true, 3, 64, 2, 'Wooden axe'), 
              new Item(1, true, 1, 64, 3, "Wooden pickaxe"), new Item(0, false, 1, 0, 4, "Stone")];
  let hats =[];
  let crafts=[new Craft([[1, 10]], 0, [2, 1]), new Craft([[1, 10]], 0, [4, 1])];
  let use = new Image();
  use.src='../Images/use.png';
  ctx.font='128px Arial';
  ctx.textAlign='center';
  let array=[[0, 0], [0, 0], [0, 0],[0, 0], [0, 0], [0, 0],[0, 0], [0, 0], [0, 0], [0, 0]];
  np=new Player(0, 0, 0, 0, array, 16);
  myname='ledinec';
  names=[];
  players={};
  let map=[];
  let builds=[0, new Build(7, 10, 1, 3, 0, 0, []), new Build(1, 20, 2, 1, 0, 0, [1, 2]), new Build(0, 10, 3,1 , 0, 128, [1, 1])];
  
  for (var i = 0; i < 4; i++) {
    anims[i].src='../Images/white'+i+'.png';
  }  
  for (var i=0; i<6; i++){
    hats[i]=[];
    for (var j=0; j<2; j++){
      hats[i][j]=new Image();
      hats[i][j].src='../Images/hat'+i+''+j+'.png';
    }
  }
  world = new World(map, players, names, []); 
  function mousedown(e)
  {
    if(e.clientX<canvas.width+1 && e.clientX>canvas.width-129 && e.clientY>canvas.height-128)
    {
      let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
      let tx=normalized[2];
      let player=world.players[myname];
      let ty=normalized[3];
      if(world.builds[tx][ty][0]>0 && world.builds[tx][ty][0]<4)
      {
        if(world.builds[tx][ty][1]<1 && world.builds[tx][ty][0]>1)
        {
          let drop=builds[world.builds[tx][ty][0]].drops[0];
          let type=builds[world.builds[tx][ty][0]].drops[1];
          player.add_item(type, drop);
          world.builds[tx][ty]=[0, 0, 0];   
        }
        else {
          world.builds[tx][ty][1]-=items[player.inventory[player.selected][0]].pow;
        }            
      }
    }
    if(e.clientX<crafts.length*32 && e.clientY>-1)
    {
      crafts[Math.floor(e.clientX/32)].doCraft(world.players[myname]);
    }
  }
  function wheelUse(e) {

  }
  function keyPress(e) {
    let keyNum;
    if (window.event) {
        keyNum = window.event.keyCode;
        let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
        speed=world.players[myname].speed*tiles[world.map[normalized[2]][normalized[3]]].speed;
        if(keyNum==87)
        {
          world.players[myname].y-=speed;
          world.players[myname].anim+=1;
        }
        else if(keyNum==83)
        {
          world.players[myname].y+=speed;
          world.players[myname].anim+=1;
        }
        else if(keyNum==65)
        {
          world.players[myname].x-=speed;
          world.players[myname].anim+=1;
          world.players[myname].angle=0;
        }
        else if(keyNum==68)
        {
          world.players[myname].x+=speed;
          world.players[myname].anim+=1;
          world.players[myname].angle=2;
        }
        else if(keyNum==69)
        {
          let normalized=normal(Math.round(world.players[myname].x/128), Math.round(world.players[myname].y/128));
          let tx=normalized[2];
          let player=world.players[myname];
          let ty=normalized[3];
          if(world.builds[tx][ty][0]>0 && world.builds[tx][ty][0]<4)
          {
            if(world.builds[tx][ty][1]<1 && world.builds[tx][ty][0]>1)
            {
              let drop=builds[world.builds[tx][ty][0]].drops[0];
              let type=builds[world.builds[tx][ty][0]].drops[1];
              player.add_item(type, drop);
              world.builds[tx][ty]=[0, 0, 0];   
            }
            else if(builds[world.builds[tx][ty][0]].instrument==items[player.inventory[player.selected][0]].type) {
              world.builds[tx][ty][1]-=items[player.inventory[player.selected][0]].pow;
            }            
          }
        }
        else if(keyNum<58 && keyNum>47)
        {
          let digit=keyNum%48;
          world.players[myname].selected=digit;
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
    let player=world.players[myname];
    if(player.x/128<0 || player.x/128>world.map.length-1)
    {
      player.x=Math.round(modulo(player.x/128, world.map.length-1))*128;
    }
    if(player.x/128<0 || player.x/128>world.map.length-1)
    {
      player.y=Math.round(modulo(player.y/128, world.map.length-1))*128;
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
        if(world.builds[tx][ty][0]<4 && world.builds[tx][ty][0]>0)
        {
          let drawObject=builds[world.builds[tx][ty][0]];
          world.builds[tx][ty][2]=(world.builds[tx][ty][2]+1)&drawObject.images.length;
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
    for (var i=0; i<array.length; i++)
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
    for(var i=0; i<crafts.length;i++)
    {
      ctx.strokeRect(i*32, 0, 32, 32);
      ctx.drawImage(items[crafts[i].result[0]].image, i*32, 0);
    }
    ctx.drawImage(use, canvas.width-128, canvas.height-128);
  }
  function start()
  {
    ctx.fillText('СОЗДАНИЕ МИРА', canvas.width/2, canvas.height/2-64);
    window.myname=document.getElementById('name').value;
    world.names=[myname];
    world.players[myname]=new Player(0, 0, 0, 0, [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0, 0]], 16, 1);
    let value=document.getElementById("size_pow").value;
    window.hat=document.getElementById('hat').value;
    document.getElementById('start').remove();
    window.world.map.length=2**value;
    world.map=[];
    world.buils=[];
    for (var i = 0; i < 2**value; i++){
      world.map[i]=[];
      world.builds[i]=[100, 0, 0];
    for (var j = 0; j < 2**value;  j++){
      world.builds[i][j]=[0, 0];
      if(Math.random()*100<90)
      {
        world.map[i][j]=0;
        if(Math.random()*100>90)
        {
          world.map[i][j]=2;
          if(Math.random()*100>70)
          {
            world.builds[i][j]=[1, builds[1].break, 0];
          }
        }
        if(Math.random()*100>80)
        {
          world.builds[i][j]=[3, builds[3].break, 0];
        }
        else if(Math.random()*100>98)
        {
          world.builds[i][j]=[2, builds[2].break, 0];
        }
      }
      else
      {
        world.map[i][j]=1;
        world.builds[i][j]=[0, 0, 0];
      }
    }
  }
    document.getElementById('field').style.visibility='visible';
    document.getElementById('field').style.marginTop='0px';
    document.onkeydown = keyPress;
    document.onmousedown = mousedown;
    setInterval(cycle, 1);
  }
