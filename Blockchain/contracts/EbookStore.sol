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
  mapping(address => EbookBuyed[]) private ebookAcquistati;
  mapping(string => Ebook) private ebookNelContratto;

  address private seller;
  uint256 private balance;

  constructor() {
    seller = msg.sender;
    addEBook(8425569239043100, "9788820077874");
    addEBook(1025569239043100, "9788806235558");
    addEBook(1525569239043100, "9788811608434");
    addEBook(6425569239043100, "9788804668698");
    addEBook(5425569239043100, "9788806222084");
  }

  function addEBook(uint256 price, string memory isbn) public {
    require(isOwner(), "Non sei il proprietario del contratto");
    require(bytes(isbn).length == 13, "ISBN non valido");
    require(ebookNelContratto[isbn].price == 0, "Ebook gia' presente nel contratto");
    Ebook memory ebook = Ebook(price, isbn);
    ebookNelContratto[isbn] = ebook;
    ebookNelContrattolist.push(ebook);
  }

  function buyEBook(string memory isbn) public payable {
    require(!isOwner(), "Sei il proprietario del contratto, non puoi acquistare libri");
    require(msg.value == ebookNelContratto[isbn].price, "Saldo insufficiente per l'acquisto");
    EbookBuyed[] memory ebooks = ebookAcquistati[msg.sender];
    bool giaAcquistato = false;
    for (uint256 i = 0; i < ebooks.length; i++) {
      if (bytes(isbn).length != bytes(ebooks[i].isbn).length) {
        continue;
      }
      if (keccak256(abi.encodePacked(isbn)) == keccak256(abi.encodePacked(ebooks[i].isbn))) {
        giaAcquistato = true;
        break;
      }
    }
    require(!giaAcquistato, "Ebook gia' acquistato");
    EbookBuyed memory ebookcomprato = EbookBuyed(msg.value, isbn, block.timestamp, msg.sender);
    ebookAcquistati[msg.sender].push(ebookcomprato);
    balance += msg.value;
  }

  function getPurchasedEBooks() public view returns (EbookBuyed[] memory) {
    return ebookAcquistati[msg.sender];
  }

  function getAllEBooks() public view returns (Ebook[] memory) {
    return ebookNelContrattolist;
  }

  function isOwner() public view returns (bool) {
    return msg.sender == seller;
  }

  function withdrawAll() public {
    require(isOwner(), "Non sei il proprietario del contratto");
    require(balance != 0, "Non ci sono fondi da prelevare");
    (bool success,) = seller.call{value : balance}("");
    require(success, "Trasferimento fallito");
    balance = 0;
  }

  function getContractBalance() public view returns (uint){
    require(isOwner(), "Non sei il proprietario del contratto");
    return balance;
  }

}
