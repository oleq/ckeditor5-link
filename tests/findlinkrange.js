/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* bender-tags: link */

import findLinkRange from '/ckeditor5/link/findlinkrange.js';
import Document from '/ckeditor5/engine/model/document.js';
import Range from '/ckeditor5/engine/model/range.js';
import Position from '/ckeditor5/engine/model/position.js';
import { setData } from '/tests/engine/_utils/model.js';

describe( 'findLinkRange', () => {
	let document, root;

	beforeEach( () => {
		document = new Document();
		root = document.createRoot();
		document.schema.allow( { name: '$text', inside: '$root' } );
		document.schema.registerItem( 'p', '$block' );
	} );

	it( 'should find link range searching from the center of the link #1', () => {
		setData( document, '<$text linkHref="url">foobar</$text>' );

		const startPosition = new Position( root, [ 3 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 0, root, 6 ) ) ).to.true;
	} );

	it( 'should find link range searching from the center of the link #2', () => {
		setData( document, 'abc <$text linkHref="url">foobar</$text> abc' );

		const startPosition = new Position( root, [ 7 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 4, root, 10 ) ) ).to.true;
	} );

	it( 'should find link range searching from the beginning of the link #1', () => {
		setData( document, '<$text linkHref="url">foobar</$text>' );

		const startPosition = new Position( root, [ 0 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 0, root, 6 ) ) ).to.true;
	} );

	it( 'should find link range searching from the beginning of the link #2', () => {
		setData( document, 'abc <$text linkHref="url">foobar</$text> abc' );

		const startPosition = new Position( root, [ 4 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 4, root, 10 ) ) ).to.true;
	} );

	it( 'should find link range searching from the end of the link #1', () => {
		setData( document, '<$text linkHref="url">foobar</$text>' );

		const startPosition = new Position( root, [ 6 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 0, root, 6 ) ) ).to.true;
	} );

	it( 'should find link range searching from the end of the link #2', () => {
		setData( document, 'abc <$text linkHref="url">foobar</$text> abc' );

		const startPosition = new Position( root, [ 10 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 4, root, 10 ) ) ).to.true;
	} );

	it( 'should find link range when link stick to other link searching from the center of the link', () => {
		setData( document, '<$text linkHref="other">abc</$text><$text linkHref="url">foobar</$text><$text linkHref="other">abc</$text>' );

		const startPosition = new Position( root, [ 6 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 3, root, 9 ) ) ).to.true;
	} );

	it( 'should find link range when link stick to other link searching from the beginning of the link', () => {
		setData( document, '<$text linkHref="other">abc</$text><$text linkHref="url">foobar</$text><$text linkHref="other">abc</$text>' );

		const startPosition = new Position( root, [ 3 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 3, root, 9 ) ) ).to.true;
	} );

	it( 'should find link range when link stick to other link searching from the end of the link', () => {
		setData( document, '<$text linkHref="other">abc</$text><$text linkHref="url">foobar</$text><$text linkHref="other">abc</$text>' );

		const startPosition = new Position( root, [ 9 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( Range.createFromParentsAndOffsets( root, 3, root, 9 ) ) ).to.true;
	} );

	it( 'should find link range only inside current parent', () => {
		setData(
			document,
			'<p><$text linkHref="url">foobar</$text></p>' +
			'<p><$text linkHref="url">foobar</$text></p>' +
			'<p><$text linkHref="url">foobar</$text></p>'
		);

		const startPosition = new Position( root, [ 1, 3 ] );
		const result = findLinkRange( startPosition, 'url' );

		expect( result ).to.instanceOf( Range );
		expect( result.isEqual( new Range( new Position( root, [ 1, 0 ] ), new Position( root, [ 1, 6 ] ) ) ) ).to.true;
	} );
} );