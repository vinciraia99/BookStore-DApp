// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EBookStoreToken is ERC20 {
  struct Ebook {
    uint256 price;
    string isbn;
  }

  Ebook[] public ebooks;
  mapping(uint256 => uint256) public ebookToToken;
  mapping(address => uint256[]) public purchasedEbooks;

  address private seller;

  constructor(
    string memory _name,
    string memory _symbol
  ) ERC20(_name, _symbol) {
    seller = msg.sender;
    //Add mock bock
    addEBook(200, "9788820077877");
    addEBook(2020, "97888210077877");
    addEBook(20, "97888210077877");
  }

  function addEBook( uint256 price,  string memory isbn) public {
    require(msg.sender == seller, "Only the seller can add eBooks");
    uint256 newEBookId = ebooks.length;
    ebooks.push(Ebook(price, isbn));
    ebookToToken[newEBookId] = newEBookId + 1;
  }

  //TODO: Acquistare tramite ISBN!
  function buyEBook(uint256 ebookId) public payable {
    Ebook storage ebook = ebooks[ebookId];
    require(msg.value == ebook.price, "Insufficient payment");
    _mint(msg.sender, ebookToToken[ebookId]);
    purchasedEbooks[msg.sender].push(ebookId);
    payable(seller).transfer(msg.value);
  }

  function getPurchasedEBooks(address buyer) public view returns (Ebook[] memory) {
    uint256[] storage purchasedIds = purchasedEbooks[buyer];
    Ebook[] memory result = new Ebook[](purchasedIds.length);
    for (uint256 i = 0; i < purchasedIds.length; i++) {
      Ebook storage ebook = ebooks[purchasedIds[i]];
      result[i] = Ebook(ebook.price, ebook.isbn);
    }
    return result;
  }

  function getAllEBooks() public view returns (Ebook[] memory) {
    Ebook[] memory result = new Ebook[](ebooks.length);
    for (uint256 i = 0; i < ebooks.length; i++) {
      Ebook storage ebook = ebooks[i];
      result[i] = Ebook(ebook.price, ebook.isbn);
    }
    return result;
  }

  function isOwner() public view returns (bool) {
    return msg.sender == seller;
  }
}
