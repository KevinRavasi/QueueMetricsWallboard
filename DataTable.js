var React = require('react');                                           //npm module import
var Table = require('react-data-components').Table;
var Pagination = require('react-data-components').Pagination;           //other components from react-data-components
var SelectField = require('react-data-components').SelectField;
var SearchField = require('react-data-components').SearchField;
var DataMixin = require('react-data-components').DataMixin;

var DataTable = React.createClass({                                    //data table class creation

  mixins: [ DataMixin ],

  render() {
    var page = this.buildPage();

    return (
      <div className={this.props.className}>                            //wrapper div
        
        <Table
          className="table table-bordered"                              //class name
          dataArray={page.data}                                         //the actual data
          columns={this.props.columns}                                  //column definition
          keys={this.props.keys}                                        //key attributes
          buildRowOptions={this.props.buildRowOptions}                  //options
          sortBy={this.state.sortBy}                                    //the field to consider when sorting
          onSort={this.onSort}                                    
        />
      </div>
    );
  },
});

module.exports = DataTable;
