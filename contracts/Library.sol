pragma solidity ^0.4.0;

contract Library {
	address[10] public users; //用来记每一本书的地址

	function user(uint id) public returns (uint) {
		require(id>=0 && id<=9);
		users[id]=msg.sender;
		return id;
	}

	function getUsers() public view returns (address[10]) {
		return users;
	}
	
}