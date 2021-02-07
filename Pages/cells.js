const world_wide=100;
const born_energy=300;
const world_height=100;
const max_command=20;
const death_energy=100;
const sun=1000;
let null_code = [];
for (var i = 0; i < 16; i++) {
	null_code[i]=max_command;
}
const code_len = null_code.length;
const moves = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
function sig(n)
{
	return 1/(1+Math.E**-n);
}
function normal(x, y)
{
	if( x>world_wide-1 )
	{
		x = x-world_wide;
	}
	else if( x<0 )
	{
		x = world_wide+x;
	}
	if( y<0 )
	{
		y = world_wide+y;
	}
	else if( y>world_wide-1 )
	{
		y = y-world_wide;
	}
	//console.log(x, y)
	return [x, y];
}
class Bot
{
	constructor(x, y, energy, counter, code, type, killed, angle, thing)
	{
		this.thing=thing;
		this.angle=angle;
		this.code=code;
		this.counter=counter;
		this.pos=[x, y];
		this.type=type;
		this.killed=killed;
		this.energy=energy;
	}
	is_me(code)
	{
		let num=0;
		for( var i = 0; i<code_len; i++)
		{
			if(code[i]==this.code[i])
			{
				num++;
			}
		}
		if( num<code_len-1 )
		{
			return false;
		}
		return true;
	}
	born()
	{
		let px = Math.round(Math.random()*2)-1;
		let py = Math.round(Math.random()*2)-1;
		let normalized = normal(this.pos[0]+px, this.pos[1]+py);
		px = normalized[0];
		py = normalized[1];
		let newCode = this.code;
		if( Math.round(Math.random()*5)==3 && this.thing!=="mutate" )
		{
			newCode[Math.round(Math.random()*code_len)]=Math.round(Math.random()*32);
		}
		if(world[px][py].type==0)
		{
			world[px][py]=new Bot(px, this.pos[1], this.energy/2, 0, newCode, 1, 0, 0);
			this.energy/=2;
			return false;
		}
		return true;
	}
	do_code(i, n)
	{
		if (n>30)
		{
			return false;
		}
		if ( i<8 )
		{
			let normalized = normal(this.pos[0] + moves[i][0], this.pos[1] + moves[i][1]);
			let nx = normalized[0];
			let ny = normalized[1];
			if( world[nx][ny].type==0 )
			{
				world[nx][ny] = new Bot(nx, ny, this.energy, this.counter, this.code, 1, this.killed, this.angle, this.thing);
				world[this.pos[0]][this.pos[1]] = new Bot(this.pos[0], this.pos[1], 0, 0, null_code, 0, 0, 0); 
				this.counter+=1;
			}		
			else if( world[nx][ny].type==1 && this.is_me(world[nx][ny].code))
			{
				this.counter+=2;
			}
			else if( world[nx][ny].type==1 )
			{
				this.counter+=3;
			}
			return true;
		}
		if ( i<16 && i>7)
		{
			let normalized = normal(this.pos[0] + moves[i%8][0], this.pos[1] + moves[i%8][1]);
			let nx = normalized[0];
			let ny = normalized[1];
			if( world[nx][ny].type==1 )
			{	
				this.energy += world[nx][ny].energy;
				world[nx][ny] = new Bot(nx, ny, 0, 0, null_code, 0, 0);
				this.killed++;
			}
			this.counter+=1;
			return true;
		}
		if ( i==16)
		{
			this.angle=(this.angle+1)%8;
			this.counter+=1;
		}
		if ( i==17 )
		{
			this.angle=(this.angle-1);
			if( this.angle<0 )
			{
				this.angle=8+this.angle;
			}
			this.counter+=1;
		}
		if ( i==18 )
		{
			let normalized = normal(this.pos[0] + moves[this.angle][0], this.pos[1] + moves[this.angle][1]);
			let nx = normalized[0];
			let ny = normalized[1];
			if( world[nx][ny].type==0 )
			{
				this.counter+=1;
			}		
			else if( world[nx][ny].type==1 && this.is_me(world[nx][ny].code))
			{
				this.counter+=2;
			}
			else if( world[nx][ny].type==1 )
			{
				this.counter+=3;
			}
		}
		if ( i==19)
		{
			let normalized = normal(this.pos[0] + moves[this.angle][0], this.pos[1] + moves[this.angle][1]);
			let nx = normalized[0];
			let ny = normalized[1];
			if( world[nx][ny].type==1 )
			{	
				this.energy += world[nx][ny].energy;
				world[nx][ny] = new Bot(nx, ny, 0, 0, null_code, 0, 0);
				this.killed++;
			}
			this.counter+=1;
			this.counter%=code_len;
			return true;
		}
		if ( i==max_command)
		{
			world[this.pos[0]][this.pos[1]].energy+=sun/world_height*(world_height-this.pos[1]);
			this.counter+=1;
			return true;
		}
		if (i>max_command)
		{
			this.counter=(this.counter+i)%code_len
		}
		i = this.code[this.counter];
		this.do_code(i, n+1);
	}
	cycle()
	{
		if( this.energy<death_energy )
		{
			world[this.pos[0]][this.pos[1]].type=0;
			this.type=0;
			world[this.pos[0]][this.pos[1]].energy=0;
			return false;
		}

		this.energy-=50;
		if( this.energy>born_energy )
		{
			this.born();
		}
		this.counter%=code_len;
		let i = this.code[this.counter];
		this.do_code(i, 0);
	}
}
let world = [];
for (var i = 0; i < world_wide; i++) {
	world[i]=[];
	for (var j = 0; j < world_height; j++) {
		world[i][j]=new Bot(i, j, 0, 0, null_code, 0, 0, 0);
	}		
}
canvas = document.getElementById("field");
ctx = canvas.getContext("2d");
canvas.width=world_wide*10;
canvas.height=world_height*10;
world[0][0]=new Bot(0, 0, 500, 0, null_code, 1, 0, 0);
function draw()
{
	for (var i = 0; i < world_wide; i++) 
	{
		for ( var j = 0; j < world_height; j++)
		{
			if(world[i][j].type==1)
			{
				world[i][j].cycle();
			}
		}
	}
}
function graph()
{
		for (var i = 0; i < world_wide; i++) 
	{
		for ( var j = 0; j < world_height; j++)
		{
			ctx.fillStyle="rgba("+(sig(world[i][j].killed)-0.5)*255+','+(sig(world[i][j].energy/100)-0.5)*255+',0, 1)'
			ctx.fillRect(i*3, j*3, 3, 3);
		}
	}	
}
setInterval(draw, 500)
setInterval(graph, 100)
canvas.onmousebuttondown