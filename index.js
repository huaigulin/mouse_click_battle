let shared;
let clickImg;
// prevent player from holding down mouse button constantly
let clicked = false;
let thisPlayerId = makeid(7);

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "kl_mouse_click_battle",
    "main"
  );
  shared = partyLoadShared("shared");
  clickImg = loadImage("assets/click.svg");
}

function setup() {
  createCanvas(600, 400);
  noStroke();
  // clear shared object on first user entry
  if (partyIsHost()) {
    partySetShared(shared, {});
    shared.players = {};
  }
  shared.left = 0.5;
  shared.right = 1 - shared.left;
  shared.players[thisPlayerId] = { mouseX: 0, mouseY: 0 };
}

function draw() {
  fill("#2196F3");
  rect(0, 0, 600 * shared.left, 400);
  fill("#E91E63");
  rect(600 * shared.left, 0, 600 * shared.right, 400);
  fill("#000000");
  textSize(24);
  textAlign(CENTER);
  imageMode(CENTER);
  if (shared.left > 0.2) {
    if (shared.left >= 1) {
      text("Blue Team Won!", 300, 200);
    } else {
      image(clickImg, (600 * shared.left) / 2, 160);
      text("Blue Team", (600 * shared.left) / 2, 200);
    }
  }
  if (shared.right > 0.2) {
    if (shared.right > 1) {
      text("Red Team Won!", 300, 200);
    } else {
      image(clickImg, 600 * shared.left + (600 * shared.right) / 2, 160);
      text("Red Team", 600 * shared.left + (600 * shared.right) / 2, 200);
    }
  }

  if (mouseIsPressed) {
    if (mouseY >= 0 && mouseY <= 400 && !clicked) {
      clicked = true;
      // let r = 0;
      // setInterval(() => {
      //   if (r < 37) {
      //     fill("#FFFFFF");
      //     ellipse(mouseX, mouseY, r, r);
      //     r++;
      //   }
      // }, 2);
      shared.players[thisPlayerId].mouseX = mouseX;
      shared.players[thisPlayerId].mouseY = mouseY;
      if (mouseX < 600 * shared.left) {
        shared.left += 0.01;
        shared.right = 1 - shared.left;
      } else {
        shared.right += 0.01;
        shared.left = 1 - shared.right;
      }
    }
  } else {
    clicked = false;
    shared.players[thisPlayerId].mouseX = 0;
    shared.players[thisPlayerId].mouseY = 0;
  }
  for (const player in shared.players) {
    if (shared.players[player].mouseX && shared.players[player].mouseY) {
      fill("#FFFFFF");
      ellipse(
        shared.players[player].mouseX,
        shared.players[player].mouseY,
        36,
        36
      );
    }
  }
}

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
