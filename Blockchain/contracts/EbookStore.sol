pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract EbookStore  {
  struct Ebook {
    address buyer;
    uint price;
    uint purchaseDate;
    string isbn;
  }

  address private owner;
  mapping(string => Ebook) private bookBuyed;
  mapping(address => Ebook[]) private buyerToEbooks;

  constructor() {
    owner = msg.sender;
  }

  function getOwner() public view returns(string memory) {
    return Strings.toHexString(uint256(uint160(owner)), 20);
  }

  event EbookPurchased(address buyer, uint price, uint purchaseDate, string _isbn);

  function buyEbook(string memory _isbn) public payable {
    // Verifica che il prezzo del libro sia stato pagato correttamente
    require(owner != msg.sender, "bro tu non puoi");
    require(msg.value > 0, "Il prezzo del libro deve essere maggiore di 0.");
    require(bookBuyed[_isbn].buyer != msg.sender, "A si accattat gia' o libr");
    uint price = msg.value;

    // Crea un nuovo ebook e lo aggiunge all'array di tutti gli ebook
    Ebook memory newEbook = Ebook(msg.sender, price, block.timestamp, _isbn);
    bookBuyed[_isbn] = newEbook;

    // Aggiunge l'ebook all'array degli ebook dell'acquirente
    buyerToEbooks[msg.sender].push(newEbook);

    // Emette un evento per registrare l'acquisto
    emit EbookPurchased(msg.sender, price, block.timestamp, _isbn);
  }

  function getBuyerEbooks2() public view returns (Ebook[] memory) {
    return buyerToEbooks[msg.sender];
  }

  function getLen() public view returns (uint) {
    uint x = buyerToEbooks[msg.sender].length;
    return x;
  }

  function getBuyerEbooks() public view returns (bool) {
    return true;
  }
}
