

const React = require('react');
const {connect} = require('react-redux');

const Message = require('../../../MapStore2/web/client/plugins/locale/Message');

const {toggleControl, setControlProperty} = require('../../../MapStore2/web/client/actions/controls');

const {changeMapStyle} = require('../../../MapStore2/web/client/actions/map');

const {Panel} = require('react-bootstrap');

const Section = require('./Section');

const {partialRight} = require('lodash');

const Menu = connect((state) => ({
    show: true, // state.controls.drawer && state.controls.drawer.enabled,
    activeKey: state.controls.drawer && state.controls.drawer.menu
}), {
    onToggle: toggleControl.bind(null, 'brugismenu', null),
    onChoose: partialRight(setControlProperty.bind(null, 'drawer', 'menu'), true),
    changeMapStyle: changeMapStyle
})(require('./Menu'));

require('./drawer.css');

const DrawerMenu = React.createClass({
    propTypes: {
        items: React.PropTypes.array,
        active: React.PropTypes.string,
        toggleMenu: React.PropTypes.func,
        id: React.PropTypes.string,
        glyph: React.PropTypes.string,
        buttonStyle: React.PropTypes.string,
        menuOptions: React.PropTypes.object,
        singleSection: React.PropTypes.bool,
        buttonClassName: React.PropTypes.string,
        menuButtonStyle: React.PropTypes.object
    },
    contextTypes: {
        messages: React.PropTypes.object,
        router: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            id: "brugismenu",
            items: [],
            toggleMenu: () => {},
            glyph: "menu-hamburger",
            buttonStyle: "default",
            menuOptions: {},
            singleSection: false,
            buttonClassName: "drawer-menu-button"
        };
    },
    renderItems() {
        return this.props.items.map((tool, index) => {
            const Plugin = tool.panel || tool.plugin;
            const plugin = (<Plugin
                isPanel={true}
                {...tool.cfg}
                items={tool.items || []}
                groupStyle={{style: {
                    marginBottom: "0px",
                    cursor: "pointer"
                }}}
                />);
            return this.props.singleSection ? (
                <Panel icon={tool.icon} glyph={tool.glyph} buttonConfig={tool.buttonConfig} key={tool.name} header={<Message msgId={tool.title}/>} eventKey={(index + 1) + ""}>
                    {plugin}
                </Panel>
            ) : (<Section key={tool.name} renderInModal={tool.renderInModal || false} eventKey={(index + 1) + ""} header={<Message msgId={tool.title} />}>
                {plugin}
            </Section>);
        });
    },
    render() {
        return (
            <div id={this.props.id}>
                <Menu single={this.props.singleSection} {...this.props.menuOptions} title={<Message msgId="menu" show={true}/>} alignment="left">
                    {this.renderItems()}
                </Menu>
            </div>
        );
    }
});

module.exports = {
    BrugisMenuPlugin: connect((state) => ({
        active: state.controls && state.controls.brugismenu && state.controls.brugismenu.active
    }), {
        toggleMenu: toggleControl.bind(null, 'brugismenu', null)
    })(DrawerMenu),
    reducers: {}
};
