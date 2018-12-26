App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('./books.json', function(data) {
      var booksRow = $('#booksRow');
      var bookTemplate = $('#bookTemplate');

      for (i = 0; i < data.length; i ++) {
        bookTemplate.find('.panel-title').text(data[i].name);
        bookTemplate.find('img').attr('src', data[i].picture);
        bookTemplate.find('.btn-borrow').attr('data-id', data[i].id);
        booksRow.append(bookTemplate.html());
      }
    });
    return await App.initWeb3();
  },

  initWeb3: async function() {
     if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
      return App.initContract();
  },

  initContract: function() {
     $.getJSON('Library.json', function(data) {
      var temp = data;
      App.contracts.Library = TruffleContract(temp);
      App.contracts.Library.setProvider(App.web3Provider);
      return App.markBorrowed();
     });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-borrow', App.handleBorrow);
  },

  markBorrowed: function(borrowers, account) {
    var borrowInstance;
    App.contracts.Library.deployed().then(function(instance) {
      borrowInstance = instance;
      return borrowInstance.getUsers.call();
    }).then(function(borrowers) {
      for (i = 0; i < borrowers.length; i++) {
        if (borrowers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-book').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBorrow: function(event) {
    event.preventDefault();
    var bookId = parseInt($(event.target).data('id'));
    var borrowInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.Library.deployed().then(function(instance) {
        borrowInstance = instance;
        return borrowInstance.user(bookId, {from: account});
      }).then(function(result) {
        return App.markBorrowed();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
