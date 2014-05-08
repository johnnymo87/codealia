describe('ContainerController', function () {
    var $scope, controller, element;

    beforeEach(module('Codealia'));
    beforeEach(inject(function ($controller) {
        $scope = {};
        controller = $controller('ContainerController', { $scope: $scope });
    }));

    beforeEach(function () {
        setFixtures('<div><div id="passions-editor"></div></div>')
        element = $('div > div#passions-editor')
    });

    describe("updatePreview()", function () {
        var previewSpy;

        beforeEach(function() {
            $scope.preview = element.parent();
            controller.setEditor($scope, element.parent());
            previewSpy = spyOn($scope.preview, 'html')
        });

        describe("without a preview", function() {
          it("does not give the preview html to the editor", function() {
            $scope.preview = undefined;
            $scope.updatePreview();
            expect(previewSpy).not.toHaveBeenCalled();
          });
        });

        describe("without an editor", function () {
            it("does not give the editor a preview html", function () {
                $scope.editor = undefined;
                $scope.updateEditor();
                expect(previewSpy).not.toHaveBeenCalled();
            });
        });

        describe("with a preview and editor defined", function () {
            it("should update the contents of the preview", function () {
                $scope.updateEditor();
                expect(previewSpy).toHaveBeenCalledWith()

            });
        });
    });

    describe("updateEditor()", function () {
        var editorSpy;

        beforeEach(function() {
            $scope.editor = element.parent();
            controller.setEditor($scope, element.parent());
            editorSpy = spyOn($scope.preview, 'html')
        });

        describe("without a preview", function () {
            it("should not copy html from preview", function () {
                $scope.preview = undefined;
                $scope.updateEditor();
                expect(editorSpy).not.toHaveBeenCalled();

            });
        });

        describe("without an editor", function () {
            xit("should not throw an exception", function () {
            });
        });

        describe("with a preview and editor defined", function () {
            xit("should update the contents of the editor", function () {
            });
        });
    });

    describe('makeEditable()', function () {
        var updateEditorSpy;

        beforeEach(function () {
            updateEditorSpy = spyOn($scope, "updateEditor");
            controller.makeEditable($scope, element);
        });

        it('sets the preview attribute on the $scope object', function () {
            expect($scope.preview).toEqual(element);
        });

        it("should update the contents of the editor", function () {
            expect(updateEditorSpy).toHaveBeenCalled();
        });
    });

    describe("setEditor()", function () {
        var aceSpy, updateEditorSpy;

        beforeEach(function () {
            aceSpy = spyOn(ace, "edit").and.callThrough();
            updateEditorSpy = spyOn($scope, "updateEditor");
            controller.setEditor($scope, element.parent());
        });

        it("should set the editor attribute on the $scope object", function () {
            expect($scope.editor).toBeDefined();
        });

        it("should call ace.edit with the #passions-editor element", function () {
            expect(aceSpy).toHaveBeenCalledWith(element[0]);
        });

        it("should register $scope.updatePreview to the on change event", function () {
            var onEventSpy = spyOn($scope.editor.getSession(), "on");
            $scope.initializeEditor();
            expect(onEventSpy).toHaveBeenCalledWith("change", $scope.updatePreview);
        });

        it("should update the contents of the editor", function () {
            expect(updateEditorSpy).toHaveBeenCalled();
        });
    });
});
