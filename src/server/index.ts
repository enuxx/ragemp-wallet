import './setup';

let lastId = 0;

mp.events.add('playerJoin', (player: PlayerMp) => {
	console.log(player.id);
	lastId += 1;
	player.outputChatBox('Welcome Here!');
	player.outputChatBox(' | =============');
	player.outputChatBox(' | Commands:');
	player.outputChatBox(' | - /balance');
	player.outputChatBox(' | - /deposit [amount]');
	player.outputChatBox(' | - /withdraw [amount]');
	player.outputChatBox(' | - /pay [user id] [amount]');
	player.info = {
		id: lastId,
		wallet: {
			hand: 1000,
			bank: 5000
		}
	};
	console.log(player.info);
});

function PayCheck() {
	let playersPaid = 0;
	mp.players.forEach((player) => {
		player.info.wallet.bank += 500;
		player.notify('You have received your paycheck of $500!');
		playersPaid += 1;
	});
	console.log(`PayCheck given to ${playersPaid} player(s)!`);
	playersPaid = 0;
}

setInterval(PayCheck, 60000);

mp.events.addCommand('deposit', (player: PlayerMp, fullText: string, amount: any) => {
	if (!amount || !parseInt(amount)) return player.outputChatBox('Usage: /deposit [amount]');
	amount = parseInt(amount);
	if (player.info.wallet.hand < amount) return player.outputChatBox('You do not have enough money!');
	player.info.wallet.hand -= amount;
	player.info.wallet.bank += amount;
	player.outputChatBox(`You have deposited $${amount} into your bank account!`);
});

mp.events.addCommand('withdraw', (player: PlayerMp, fullText: string, amount: any) => {
	if (!amount || !parseInt(amount)) return player.outputChatBox('Usage: /withdraw [amount]');
	amount = parseInt(amount);
	if (player.info.wallet.bank < amount) return player.outputChatBox('You do not have enough balance in your bank account!');
	player.info.wallet.bank -= amount;
	player.info.wallet.hand += amount;
	player.outputChatBox(`You have withdraw $${amount} from your bank account!`);
});

mp.events.addCommand('balance', (player: PlayerMp, fullText: string) => {
	player.outputChatBox(' | =============');
	player.outputChatBox(' | Balance');
	player.outputChatBox(` | - Wallet: ${player.info.wallet.hand}`);
	player.outputChatBox(` | - Bank: ${player.info.wallet.bank}`);
});

mp.events.addCommand('pay', (player: PlayerMp, fullText: string, target: any, amount: any) => {
	if (!target || !parseInt(target) || !amount || !parseInt(amount)) return player.outputChatBox('Usage: /pay [user id] [amount]');
	target = parseInt(target);
	amount = parseInt(amount);
	if (target === player.info.id) return player.outputChatBox('You cannot pay yourself!');
	if (player.info.wallet.hand < amount) return player.outputChatBox('You do not have enough money in your wallet!');
	mp.players.forEach((targetPlayer) => {
		if (targetPlayer.info.id === target) {
			player.info.wallet.hand -= amount;
			targetPlayer.info.wallet.hand += amount;
			targetPlayer.outputChatBox(`You have received $${amount} from player #${player.info.id}!`);
			player.outputChatBox(`You have paid $${amount} to player #${targetPlayer.info.id}!`);
		} else {
			return player.outputChatBox('Player not found!');
		}
	});
});

// mp.events.addCommand('balance', (player: PlayerMp, fullText: string, target: any, value: any) => {
// 	if (!target || !value) return player.outputChatBox('Usage: /pay [player] [value]');

// });

// import { SHARED_CONSTANTS } from '@shared/constants';

// mp.events.add('playerReady', (player) => {
// 	console.log(`${player.name} is ready!`);

// 	player.customProperty = 1;

// 	player.customMethod = () => {
// 		console.log('customMethod called.');
// 	};

// 	player.customMethod();
// });
