describe('iD.uiFieldAccess', function() {
    var selection, field;
    beforeEach(function() {
        selection = d3.select(document.createElement('div'));
        field = iD.Context(window)
            .presets(iD.dataPresets).presets().field('access');
    });

    it('creates inputs for a variety of modes of access', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);
        expect(selection.selectAll('.preset-access-access').size()).to.equal(1);
        expect(selection.selectAll('.preset-access-foot').size()).to.equal(1);
        expect(selection.selectAll('.preset-access-motor_vehicle').size()).to.equal(1);
        expect(selection.selectAll('.preset-access-bicycle').size()).to.equal(1);
        expect(selection.selectAll('.preset-access-horse').size()).to.equal(1);
    });

    it('does not include "yes", "designated", "dismount" options for general access (#934), (#2213)', function() {
        var access = iD.uiFieldAccess(field);
        expect(_.map(access.options('access'), 'value')).not.to.include('yes');
        expect(_.map(access.options('access'), 'value')).not.to.include('designated');
        expect(_.map(access.options('access'), 'value')).not.to.include('dismount');
    });

    it('does include a "dismount" option for bicycles (#2726)', function() {
        var access = iD.uiFieldAccess(field);
        expect(_.map(access.options('bicycle'), 'value')).to.include('dismount');
        expect(_.map(access.options('foot'), 'value')).not.to.include('dismount');
    });

    it('sets foot placeholder to "yes" for steps and pedestrian', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);

        access.tags({highway: 'steps'});
        expect(selection.selectAll('#preset-input-access-foot').attr('placeholder')).to.equal('yes');

        access.tags({highway: 'pedestrian'});
        expect(selection.selectAll('#preset-input-access-foot').attr('placeholder')).to.equal('yes');
    });

    it('sets foot placeholder to "designated" for footways', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);

        access.tags({highway: 'footway'});
        expect(selection.selectAll('#preset-input-access-foot').attr('placeholder')).to.equal('designated');
    });

    it('sets bicycle placeholder to "designated" for cycleways', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);

        access.tags({highway: 'cycleway'});
        expect(selection.selectAll('#preset-input-access-bicycle').attr('placeholder')).to.equal('designated');
    });

    it('sets horse placeholder to "designated" for bridleways', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);

        access.tags({highway: 'bridleway'});
        expect(selection.selectAll('#preset-input-access-horse').attr('placeholder')).to.equal('designated');
    });

    it('sets motor_vehicle placeholder to "no" for footways, steps, pedestrian, cycleway, bridleway, and path', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);
        ['footway', 'steps', 'pedestrian', 'cycleway', 'bridleway', 'path'].forEach(function(value) {
            access.tags({highway: value});
            expect(selection.selectAll('#preset-input-access-motor_vehicle').attr('placeholder')).to.equal('no');
        });
    });

    it('sets motor_vehicle placeholder to "yes" for various other highway tags', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);
        ['residential', 'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'service',
         'unclassified', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link'].forEach(function(value) {
            access.tags({highway: value});
            expect(selection.selectAll('#preset-input-access-motor_vehicle').attr('placeholder')).to.equal('yes');
        });
    });

    it('overrides a "yes" or "designated" placeholder with more specific access tag (#2213)', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);

        access.tags({highway: 'service', access: 'emergency'});
        expect(selection.selectAll('#preset-input-access-motor_vehicle').attr('placeholder')).to.equal('emergency');

        access.tags({highway: 'cycleway', access: 'permissive'});
        expect(selection.selectAll('#preset-input-access-bicycle').attr('placeholder')).to.equal('permissive');
    });

    it('overrides a "no" placeholder with more specific access tag (#2763)', function() {
        var access = iD.uiFieldAccess(field);
        selection.call(access);

        access.tags({highway: 'cycleway', access: 'destination'});
        expect(selection.selectAll('#preset-input-access-motor_vehicle').attr('placeholder')).to.equal('destination');
    });

});
