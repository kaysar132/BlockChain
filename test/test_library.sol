pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Library.sol";

contract test_library
{
	Library lib = Library(DeployedAddresses.Library());

	function testBorrowBook() public
	{
		uint returnedId = lib.user(2);
		uint temp = 2;
		Assert.equal(returnedId,temp,"Borrower of book ID of 2 be recorded!");
	}

	function testGetBorrowerIdByBookId() public
	{
		address temp = this;
		address borrower = lib.users(2);
		Assert.equal(borrower,temp,"Owner of book ID of 2 be recorded!");
	}

	function testGetBorrowerByArray() public
	{
		address temp = this;
		address[10] memory users = lib.getUsers();
		Assert.equal(users[2],temp,"Owner of book ID of 2 be recorded!");
	}

}