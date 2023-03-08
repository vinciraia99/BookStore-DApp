//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract EBookStore {
  struct Ebook {
    uint256 price;
    string isbn;
  }

  struct EbookBuyed {
    uint256 price;
    string isbn;
    uint purchaseDate;
    address buyer;
  }

  Ebook[] private ebookNelContrattolist;
  mapping(address => EbookBuyed[]) private ebookAcquistatiList;
  mapping(address => mapping(string => EbookBuyed)) private ebookAcquistati;
  mapping(string => Ebook) private ebookNelContratto;

  address private seller; //Rendi immutabile
  uint256 private balance;

  constructor() {
    seller = msg.sender;
  }

  function addEBook(uint256 price, string memory isbn) public {
    require(isOwner(), "Non sei il proprietario del contratto");
    require(ebookNelContratto[isbn].price == 0, "Ebook gia' presente nel contratto");
    require(bytes(isbn).length == 13, "ISBN non valido");
    Ebook memory ebook = Ebook(price, isbn);
    ebookNelContratto[isbn] = ebook;
    ebookNelContrattolist.push(ebook);
  }

  function buyEBook(string memory isbn) external payable {
    require(!isOwner(), "Sei il proprietario del contratto, non puoi acquistare libri");
    require(ebookNelContratto[isbn].price != 0, "Ebook non presente nel contratto");
    require(msg.value == ebookNelContratto[isbn].price, "Saldo insufficiente per l'acquisto");
    require(ebookAcquistati[msg.sender][isbn].price == 0, "Ebook gia' acquistato");
    EbookBuyed memory ebookComprato = EbookBuyed(msg.value, isbn, block.timestamp, msg.sender);
    ebookAcquistatiList[msg.sender].push(ebookComprato);
    ebookAcquistati[msg.sender][isbn] = ebookComprato;
    balance += msg.value;
  }

  function getPurchasedEBooks() external view returns (EbookBuyed[] memory) {
    return ebookAcquistatiList[msg.sender];
  }

  function getAllEBooks() external view returns (Ebook[] memory) {
    return ebookNelContrattolist;
  }

  function isOwner() public view returns (bool) {
    return msg.sender == seller;
  }

  function withdrawAll() external {
    require(isOwner(), "Non sei il proprietario del contratto");
    require(balance != 0, "Non ci sono fondi da prelevare");
    (bool success,) = seller.call{value : balance}("");
    require(success, "Trasferimento fallito");
    balance = 0;
  }

  function getContractBalance() external view returns (uint){
    require(isOwner(), "Non sei il proprietario del contratto");
    return balance;
  }

}
