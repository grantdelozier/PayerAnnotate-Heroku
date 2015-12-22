"use strict"

//var SpansObject;

var payerApplier;
var payerUnapplier;

var payerClass = "payer"
var locClass = "location"
var annotationClasses = [payerClass, locClass]

function addPayer() {
    addFeature(payerClass, payerApplier)
}

function addLocation() {
    addFeature(locclass, )
}

function init(page) {
    commonInit(page)

    //SpansObject = Parse.Object.extend("NESpans");

    payerApplier = rangy.createClassApplier(payerClass, {
        elementAttributes: {onclick:"spanClick(this)"},
        normalize: false
    });

    locApplier = rangy.createClassApplier(locClass, {
        elementAttributes: {onclick:"spanClick(this)"},
        normalize: false
    });

    payerUnapplier = rangy.createClassApplier(payerClass, {
        elementAttributes: {onclick:"spanClick(this)"},
        normalize: true
    });

    locUnapplier = rangy.createClassApplier(locClass, {
        elementAttributes: {onclick:"spanClick(this)"},
        normalize: true
    });


    annotationClassesAndAppliers = [
        {clazz: payerClass, applier: payerApplier, unapplier: payerUnapplier}, {clazz: locclass, applier: locApplier, unapplier:locUnapplier}
    ]

    keyCodeActions = [
        {code: 65, action: addPayer},
        {code: 67, action: addLocation},
        {code: 82, action: removeAnnotation}
    ]
}

// Set 4-space indentation for vi
// vi:sw=4
