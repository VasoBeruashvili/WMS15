

function FindControl(parentForm, controlItemId) {
    return parentForm.down('#' + controlItemId);
}

function fileDownload(url, params) {
    var form = Ext.create('Ext.form.Panel', {
        hidden: true,
        bodyPadding: 10,
        title: 'My Form',
        standardSubmit: true,
    });
    if (IsNullOrEmpty(params.windowid)) {
        params.windowid = GetWindowId();
    }
    form.getForm().submit({
        url: url,
        params: params,
        success: function (form, action) {
            console.log(action);
        },
        failure: function (form, action) {
            console.log(action);
        }
    });
}

function GetWindowId() {
    return window.name;
}


function DateFormat(dateobject, format) {
    var f = format || 'd.m.Y';

    return Ext.Date.format(dateobject, f);
}

function StringFormat(str) {
    for (i = 1; i < arguments.length; i++) {
        str = str.replace("{" + (i - 1) + "}", arguments[i]);
    }
    return str;
}

function GetDateRange(sourceDate, config) {
    var fromDate = new Date(sourceDate.getTime());
    var toDate = new Date(sourceDate.getTime());

    var newYear = sourceDate.getFullYear() + config.Year;
    var newMonth = sourceDate.getMonth() + config.Month;
    var newDate = sourceDate.getDate() + config.Date;

    fromDate.setFullYear(newYear);
    fromDate.setMonth(newMonth);
    fromDate.setDate(newDate);

    var dateRange = {
        fromDate: null,
        toDate: null
    };

    if (fromDate < toDate) {
        dateRange.fromDate = fromDate;
        dateRange.toDate = toDate;
    }
    else {
        dateRange.fromDate = toDate;
        dateRange.toDate = fromDate;
    }

    return dateRange;
}

function copyTreeNode(node, childProperty) {
    if (!IsNullOrEmpty(node)) {
        var tempNode = node.getData();
        node.associations.each(function (assoc) {
            tempNode[assoc.associationKey] = node.getAssociatedData()[assoc.associationKey];
        });
        tempNode[childProperty] = [];
        for (var i = 0; i < node[childProperty].length; i++) {
            var child = node[childProperty][i];
            tempNode[childProperty].push(copyTreeNode(child, childProperty));
        }
        return tempNode;
    }
    else
        return null;
};

function CmpQuery(selector) {
    return Ext.ComponentQuery.query(selector);
};


function LogOutSafe(tabpanel) {
    var safetologout = true;

    var stufftoclose = [];
    Ext.each(tabpanel.items.items, function (item) {
        var form = item.down('panel');
        if (IsNull(form))
            return;
        else {
            if (form.isDataChanged === undefined)
                stufftoclose.push(item);
            else {
                if (form.isDataChanged()) {
                    safetologout = false;
                    Ext.each(stufftoclose, function (item) {
                        item.close();
                    });
                    tabpanel.setActiveTab(item);
                    CheckAction('შეუნახავი მონაცემები დაიკარგება! გინდათ გასვლა?!', function () {
                        //item.on('close', function (panel, eOpts) {
                            //setTimeout(function () {
                            item.suspendEvents(false);
                            item.close();
                            LogOutSafe(tabpanel);
                         //   }
                         //, 5000);
                        //});
                    });
                    return false;
                }
                else
                    stufftoclose.push(item);
            }
        }
    });

    if (safetologout) {
        Ext.each(stufftoclose, function (item) {
            item.close();
        });

        //tab sync

        window.localStorage.setItem('login', false);

        window.location = '/Login/Logout';
    }
    return safetologout;
}

function CheckAction(question, action) {
    Ext.Msg.show({
        msg: question,
        buttons: Ext.MessageBox.YESNO,
        fn: function (buttonId) {
            if (buttonId == 'yes') {
                action();
            }
        }
    });
}


function MakeChoose(question, actionyes, actionno) {
    Ext.Msg.show({
        msg: question,
        buttons: Ext.MessageBox.YESNO,
        fn: function (buttonId) {
            if (buttonId == 'yes') {
                actionyes();
            }
            else {
                actionno();
            }
        }
    });
};

function MessageBox(title, message) {
    Ext.Msg.alert({
        title: title,
        msg: message,
        buttons: Ext.Msg.OK
    });
}



function SetDelete(model) {
    model.set('Deleted', true);
}
function SetUnDelete(model) {
    model.set('Deleted', true);
}

function FindModelInCollection(modelArray, model, key) {
    var result = null;

    key = key || 'ID';

    var keyToFind = model.get(key);

    if (keyToFind == null || keyToFind == undefined || keyToFind == 0) {
        return result;
    }

    Ext.each(modelArray, function (item) {
        var k = item.get(key);
        if (k == null || k == undefined || k == 0 || k != keyToFind) {
            return true;
        }
        else {
            result = item;
            return false;
        }

    });

    return result;

}

//Davamate, true tu massivshi arsebobs aseti value
function arrayContainsValue(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value)
            return true;
    }
    return false;

}
function arrayContainsValues(array, values) {
    for (var i = 0; i < values.length; i++) {
        if (!arrayContainsValue(array, values[i])) {
            return false;
        }
    }
    return true;
}

function ContainsModel(modelArray, model, key) {
    return FindModelInCollection(modelArray, model, key) != null;
}

function AddIfNotContains(modelArray, model, key) {
    if (!ContainsModel(modelArray, model, key)) {
        modelArray.push(model);
    }
}

function FindModelByProperty(modelArray, property, value) {
    var model = FirstOrDefault(modelArray, function (item) { return item.get(property) == value });

    return model;//

}
//  M.O. 09.01.2014 START
function FindModelInCollectionByKey(modelArray, model, keyInArray, modelKey) {
    var result = null;

    modelKey = modelKey || 'ID';

    var keyToFind = model.get(modelKey);

    if (keyToFind === null || keyToFind === undefined || keyToFind === 0) {
        return result;
    }

    Ext.each(modelArray, function (item) {
        var k = item.get(keyInArray);
        if (k === null || k === undefined || k === 0 || k != keyToFind) {
            return true;
        }
        else {
            result = item;
            return false;
        }

    });

    return result;
}

function ContainsModelByKey(modelArray, model, keyInArray, modelKey) {
    return FindModelInCollectionByKey(modelArray, model, keyInArray, modelKey) !== null;
}
// END

//TODO pri ukazanii winapiroba predmeti tolko iz predidushix modulei
//TODO pri dobavlenii premdete esli u nego est winpiroba proverku delat tolko v predidusxhix moduliax i v predidushix semestrax tekushchego modulia




function SumOfField(modelArray, field, zeroSum, fn) {
    var fn = fn || function (a, b) {
        return a + b;
    };

    var s = zeroSum || 0;

    if (IsNullOrEmpty(field)) {
        throw "field name must be provided";
    }

    Ext.each(modelArray, function (model) {
        s = fn(s, model.get(field));
    });


}

function ArrayEmptyOrNull(array) {
    if (array == null || array.length == 0)
        return true;
}

//comparer function(a, b) return 0 equals, -1 less, 1 greater
function Max(modelArray, comparer) {
    if (ArrayEmptyOrNull(modelArray))
        return null;
    if (IsNull(comparer))
        throw "Comparer cannot be null";

    if (modelArray.length == 0)
        throw "Array cant be empty";

    var start = modelArray[0];



    Ext.each(modelArray, function (item) {
        if (comparer(start, item) < 0) {
            start = item;
        }
    });

    return start;
}


function Min(modelArray, comparer) {
    if (ArrayEmptyOrNull(modelArray))
        return null;
    if (IsNull(comparer))
        throw "Comparer cannot be null";

    if (modelArray.length == 0)
        throw "Array cant be empty";

    var start = modelArray[0];



    Ext.each(modelArray, function (item) {
        if (comparer(start, item) > 0) {
            start = item;
        }
    });

    return start;
}


function MaxOfTwo(a, b) {
    if (a >= b)
        return a;
    else return b;
}


function Sum(modelArray, selector, zeroSum) {
    var sum = zeroSum || 0;

    Ext.each(modelArray, function (model) {
        sum += selector(model);
    });

    return sum;
}


function All(modelArray, condition) {

    if (IsNull(condition)) {
        throw "condition function can not be null";
    }

    var result = true;

    Ext.each(modelArray, function (model) {
        result = result && condition(model);
    });

    return result;
}

function Any(modelArray, condition) {
    if (IsNull(condition)) {
        throw "condition function can not be null";
    }

    var result = false;

    Ext.each(modelArray, function (model) {
        result = result || condition(model);
    });

    return result;
}


function FirstOrDefault(modelArray, condition) {
    //if (IsNull(condition)) {
    //    throw "condition function can not be null";
    //}

    var condition = condition || function () { return true; };

    var result = null;

    Ext.each(modelArray, function (model) {
        result = condition(model) ? model : null;
        return IsNullOrEmpty(result);
    });

    return result;
}


//config { selector: fn, comparer: fn}
function OrderBy(objects, config) {
    if (config != null && (config.selector != null || config.comparer != null)) {
        var checker = config.comparer || function (a, b) { return config.selector(a) - config.selector(b) };

        objects.sort(checker);


    }
}


//TODO
function GetFormState(form) {

    var state={
        grids: {}
    };

    var grids = form.query('grid[stateOrder]');

    OrderBy(grids, { selector: function (item) { return item.stateOrder; } });


    Ext.each(grids, function (grid) {
        if (grid.recordSelected()) {
            var stateKey = grid.stateKey || 'ID';
            state.grids[grid.stateOrder] = { stateKey: grid.getSelectedRecord().get(stateKey) };
        }
    });



}





function GetSemesterBeforeIndexNumber(semesters, indexNumber) {
}



//winapirobistvis
function GetAllCoursesFromProgram(programModel, config) {

    var courses = [];

    var config = config || {};

    var defaultConfig = {
        semesterIndex: 100000,//no check
        //moduleIndex: 10000,// no check
        templateBlockIndex: 10000,//no check
        currentModuleID: -0.5,//never matches module id even tracked module id which is < 0
        before: true//get courses before or after
    };

    Ext.applyIf(config, defaultConfig);

    var programStructure = programModel.getProgramStructure();

    var blocks = [];

    var currentTplBlock = null;

    //get previous tplblocks
    Ext.each(programStructure.ProgramStructuralBlocks().getNotDeletedRecords(), function (item) {
        var condition = false;
        if (config.before) {
            condition = item.get('IndexNumber') < config.templateBlockIndex;
        }
        else {
            condition = item.get('IndexNumber') > config.templateBlockIndex;
        }

        if (condition) {
            Ext.each(item.ProgramBlocks().getNotDeletedRecords(), function (item1) {
                blocks.push(item1);

            });
        }
        if(item.get('IndexNumber') == config.templateBlockIndex) {
            currentTplBlock = item;
            //return false;
        }
        return true;
    });

    var semesters = [];


    //get all semesters from previous (or next - config.before = false) tpl blocks
    Ext.each(blocks, function (item) {
        var s = item.Semesters().getNotDeletedRecords();

        Ext.each(s, function (item1) {
            semesters.push(item1);

            return true;
        });

        return true;
    });


    //get previuos (next - config.before = false) semesters from current block
    if (currentTplBlock != null) {
        Ext.each(currentTplBlock.ProgramBlocks().getNotDeletedRecords(), function (item) {
            if (item.get('ID') == config.currentModuleID) {
                Ext.each(item.Semesters().getNotDeletedRecords(), function (item1) {
                    var condition = false;
                    if (config.before) {
                        condition = item1.get('IndexNumber') < config.semesterIndex;
                    }
                    else {
                        condition = item1.get('IndexNumber') > config.semesterIndex;
                    }

                    if (condition) {
                        semesters.push(item1);
                    }
                });
            }
        });
    }


    var parentunits = [];

    Ext.each(semesters, function (item) {

        //if (item.get('IndexNumber') < config.semesterIndex) {

        var tmpunits = item.ProgramBlockUnits().getNotDeletedRecords();

        Ext.each(tmpunits, function (item1) {
            parentunits.push(item1);
            return true;
        });
        return true;

    });


    var coursefetcher = function (programBlockUnit) {
        var tmpcourses = programBlockUnit.Courses().getNotDeletedRecords();

        Ext.each(tmpcourses, function (item) {
            AddIfNotContains(courses, item);
        });

        var childunits = programBlockUnit.ChildUnits().getNotDeletedRecords();

        for (var i = 0; i < childunits.length; i++) {
            coursefetcher(childunits[i]);
        }

    }

    Ext.each(parentunits, function (item) {
        coursefetcher(item);
    });


    return courses;


}



function CheckDeleteCourse(programModel, coursemodel, templateBlockIndex, moduleID, semesterIndex) {
    var nextcourses = GetAllCoursesFromProgram(programModel, {
        templateBlockIndex: templateBlockIndex,
        currentModuleID: moduleID,
        semesterIndex: semesterIndex,
        before: false
    });


    var allow = !Any(nextcourses, function (item) {
        return Any(item.RequiredCourses().getNotDeletedRecords(), function (item2) {
            return item2.get('ID') == coursemodel.get('ID');
        });
    });

    return allow;
}

function GetConflictingRequirement(programModel, coursemodel, templateBlockIndex, moduleID, semesterIndex) {
    var nextcourses = GetAllCoursesFromProgram(programModel, {
        templateBlockIndex: templateBlockIndex,
        currentModuleID: moduleID,
        semesterIndex: semesterIndex,
        before: false
    });

    var result = null;

    if (!CheckDeleteCourse(programModel, coursemodel, templateBlockIndex, moduleID, semesterIndex)) {

        result = FirstOrDefault(nextcourses, function (item) {

            var x = Any(item.RequiredCourses().getNotDeletedRecords(), function (item2) {
                var t1 = item2.get('ID') == coursemodel.get('ID');
                return t1;
            });

            return x;
        });
    }

    return result;
}


//TODO done
function CheckDeleteProgramBlockUnit(programModel, programBlockUnitModel, templateBlockIndex, moduleID, semesterIndex) {

    var messages = [];



    var requirement = null;

    var unitType = programBlockUnitModel.get('ProgramUnitTypeID');



    var prefix = programBlockUnitModel.get('ProgramUnitTypeName') + 'ს წაშლა არ შეიძლება, რადგან';

    if (unitType == EnumProgramBlockUnitType.Course) {
        var course = programBlockUnitModel.Courses().getNotDeletedRecords()[0];
        requirement = GetConflictingRequirement(programModel, course, templateBlockIndex, moduleID, semesterIndex);

        if (!IsNullOrEmpty(requirement)) {
            messages.push(prefix + ' მასზე დამოკიდებულია სასწავლო კურსი <strong>' + requirement.get('Name') + '</strong>');
        }
    }
    else if (unitType == EnumProgramBlockUnitType.SelectiveCourse) {
        var selectivecourse = FirstOrDefault(programBlockUnitModel.Courses().getNotDeletedRecords(), function (item) {
            requirement = GetConflictingRequirement(programModel, item, templateBlockIndex, moduleID, semesterIndex);
            return !IsNullOrEmpty(requirement);
        });
        if (!IsNullOrEmpty(selectivecourse)) {
            messages.push(prefix + ' მასში არსებულ სასწავლო კურსზე <strong>' + selectivecourse.get('Name') + '</strong> დამოკიდებულია სასწავლო კურსი <strong>' + requirement.get('Name') + '</strong>');
        }
    }
    else if (unitType == EnumProgramBlockUnitType.SelectiveGroup) {
        var blockcourse = null;

        var block = FirstOrDefault(programBlockUnitModel.ChildUnits().getNotDeletedRecords(), function (courseblock) {
            var b = FirstOrDefault(courseblock.Courses().getNotDeletedRecords(), function (item) {
                requirement = GetConflictingRequirement(programModel, item, templateBlockIndex, moduleID, semesterIndex);
                if (!IsNullOrEmpty(requirement)) {
                    blockcourse = item;
                }
                return !IsNullOrEmpty(requirement);
            });
            return !IsNullOrEmpty(b);
        });

        if (block != null) {
            messages.push(prefix + ' მასში არსებულ ბლოკში <strong>' + block.get('Name') + '</strong> არის სასაწვლო კურსი <strong>' + blockcourse.get('Name') + '</strong> რომელზეც დამოკიდებულია <strong> სასწავლო კურსი ' + requirement.get('Name') + '</strong>');
        }


    }

    var result = {
        allow: messages.length == 0,
        error: messages.length > 0 ? messages[0] : null
    };

    return result;


}


//TODO done
function CheckDeleteModule(programModel, programBlockModel, templateBlockIndex) {
    var result = {
        allow: true,
        error: ""
    };

    var semesters = programBlockModel.Semesters().getNotDeletedRecords();

    var dependentModule = null;

    var modules = GetAllBlocksFromProgram(programModel, { templateBlockIndex: templateBlockIndex, before: false });

    Ext.each(modules, function (module) {

        var isRequired = Any(module.RequiredBlocks().getNotDeletedRecords(), function (item) { return item.get('ID') == programBlockModel.get('ID'); });
        if (isRequired) {
            dependentModule = module;
        }

        return !isRequired;//!IsNullOrEmpty(dependentModule);
    });


    if (!IsNullOrEmpty(dependentModule)) {
        result.allow = false;
        result.error = 'მოდულის წაშლა არ შეიძლება რადგან მასზე არის დამოკიდებული მოდული <strong>' + dependentModule.get('Name') + '</strong>';

        return result;
    }




    Ext.each(semesters, function (semester) {
        var units = semester.ProgramBlockUnits().getNotDeletedRecords();
        Ext.each(units, function (unit) {

            var tmpresult = CheckDeleteProgramBlockUnit(programModel, unit, templateBlockIndex);

            if (!tmpresult.allow) {
                result.allow = tmpresult.allow;
                result.error = 'მოდულის წაშლა არ შეიძება რადგან მასში არის ' + unit.get('ProgramUnitTypeName') + ' <strong>' + unit.get('Name') + '</strong>.' + tmpresult.error;
            }

            return result.allow;

        });

        return result.allow;
    });


    return result;

}



function GetProgramBlockUnitMaxCreditCount(programBlockUnitModel) {
    var unitType = programBlockUnitModel.get('ProgramUnitTypeID');

    var result = 0;

    if (unitType == EnumProgramBlockUnitType.Course) {
        result = programBlockUnitModel.Courses().getNotDeletedRecords()[0].get('CreditCount');
    }
    else if (unitType == EnumProgramBlockUnitType.SelectiveCourse) {
        if (programBlockUnitModel.Courses().getNotDeletedRecords().length > 0) {
            result = Max(programBlockUnitModel.Courses().getNotDeletedRecords(), function (a, b) { return a.get('CreditCount') - b.get('CreditCount') }).get('CreditCount');
        }
    }
    else if (unitType == EnumProgramBlockUnitType.SelectiveBlock) {
        result = Sum(programBlockUnitModel.Courses().getNotDeletedRecords(), function (item) { return item.get('CreditCount'); });
    }
    else if (unitType == EnumProgramBlockUnitType.SelectiveGroup) {
        if (programBlockUnitModel.ChildUnits().getNotDeletedRecords().length > 0) {
            var maxBlock = Max(programBlockUnitModel.ChildUnits().getNotDeletedRecords(), function (a, b) {
                var s1 = Sum(a.Courses().getNotDeletedRecords(), function (item) { return item.get('CreditCount'); });
                var s2 = Sum(b.Courses().getNotDeletedRecords(), function (item) { return item.get('CreditCount'); });
                return s1 - s2;
            });

            result = Sum(maxBlock.Courses().getNotDeletedRecords(), function (item) { return item.get('CreditCount'); });
        }
    }

    return result;


}


function GetSemesterMaxCreditCount(filledProgramTemplateBlockSemesterModel) {
    var totalMaxCredits = 0;

    Ext.each(filledProgramTemplateBlockSemesterModel.ProgramBlockUnits().getNotDeletedRecords(), function (item) {
        totalMaxCredits += GetProgramBlockUnitMaxCreditCount(item);
    });

    return totalMaxCredits;

}





function GetAllCoursesFromBlock(programBlockModel) {
    var semesters = programBlockModel.Semesters().getNotDeletedRecords();
    var courses = [];

    Ext.each(semesters, function (semester) {
        var tmpcourses = GetAllCoursesFromSemester(semester);

        Ext.each(tmpcourses, function (course) {
            courses.push(course);
        });

    });

    return courses;

}


function GetAllCoursesFromSemester(filledProgramTemplateBlockSemesterModel) {
    var courses = [];

    var units = [];

    Ext.each(filledProgramTemplateBlockSemesterModel.ProgramBlockUnits().getNotDeletedRecords(), function (item) {
        units.push(item);
    });

    Ext.each(units, function (item) {

        var tmpcourses = item.Courses().getNotDeletedRecords();
        Ext.each(tmpcourses, function (course) {

            courses.push(course);
        });
    });


    return courses;
}


//winapirobistvis
function GetAllBlocksFromProgram(programModel, config) {
    var config = config || {};

    var defaultConfig = {
        templateBlockIndex: 10000,// no check
        before: true
    };

    Ext.applyIf(config, defaultConfig);

    var programStructure = programModel.getProgramStructure();

    var structBlocks = [];

    Ext.each(programStructure.ProgramStructuralBlocks().getRecords(), function (item) {
        var condition = false;
        if (config.before) {
            condition = config.templateBlockIndex > item.get('IndexNumber');
        }
        else {
            condition = config.templateBlockIndex < item.get('IndexNumber')
        }

        if (condition) {
            structBlocks.push(item);
        }
        return true;
    });


    var blocks = [];

    Ext.each(structBlocks, function (item) {
        Ext.each(item.ProgramBlocks().getNotDeletedRecords(), function (item1) {
            blocks.push(item1);

        });
    });


    return blocks;
}




function CopyModule(sourceModule, sourceTplBlock, destinationTplBlock) {

    structBlock = destinationTplBlock;

    //prepare empty model

    var emptyModel = MakeTrackedModel('SIS.model.ProgramBlockModel');//Ext.create('SIS.model.ProgramBlockModel');

    emptyModel.set('ProgramTemplateBlockIndex', structBlock.get('IndexNumber'));

    emptyModel.set('Name', sourceModule.get('Name'));


    Ext.each(sourceModule.RequiredBlocks().getNotDeletedRecords(), function (item) {
        var t = CloneModel(item);
        emptyModel.RequiredBlocks().add(t);
    });

    Ext.each(sourceModule.RequiredCourses().getNotDeletedRecords(), function (item) {
        var t = CloneModel(item);
        emptyModel.RequiredCourses().add(t);
    });


    var semesters = structBlock.BlockSemesters().getRecords();

    var modelMap = [];

    Ext.each(semesters, function (item) {
        var tmpmodel = Ext.create('SIS.model.FilledProgramTemplateBlockSemesterModel');
        tmpmodel.set('ID', item.get('ID'));

        tmpmodel.set('IndexNumber', item.get('IndexNumber'));

        tmpmodel.set('SemesterTypeName', item.get('SemesterTypeName'));

        tmpmodel.set('SemesterTypeCreditCount', item.get('SemesterTypeCreditCount'));

        emptyModel.Semesters().add(tmpmodel);

        modelMap[item.get('IndexNumber')] = tmpmodel;
    });


    //copy program block units


    var sourceMinSemsterIndex = Min(sourceTplBlock.BlockSemesters().getNotDeletedRecords(), function (a, b) { return a.get('IndexNumber') - b.get('IndexNumber'); }).get('IndexNumber');

    var destinationMinSemesterIndex = Min(destinationTplBlock.BlockSemesters().getNotDeletedRecords(), function (a, b) { return a.get('IndexNumber') - b.get('IndexNumber'); }).get('IndexNumber');


    Ext.each(sourceModule.Semesters().getNotDeletedRecords(), function (sourceSemester) {
        var destinationIndex = sourceSemester.get('IndexNumber') - sourceMinSemsterIndex + destinationMinSemesterIndex;

        Ext.each(sourceSemester.ProgramBlockUnits().getNotDeletedRecords(), function (unit) {
            var t = CloneModel(unit);

            t = ResetProgramBlockUnitID(t);

            modelMap[destinationIndex].ProgramBlockUnits().add(t);
        });

    });



    return emptyModel;


}



function ResetProgramBlockUnitID(programBlockUnit) {

    var unitType = programBlockUnit.get('ProgramUnitTypeID');
    programBlockUnit.set('ID', 0);
    programBlockUnit.set('ProgramBlockID', 0);
    programBlockUnit.set('ProgramTemplateBlockSemesterID', 0);
    programBlockUnit.set('ParentID', null);


    if (unitType == EnumProgramBlockUnitType.SelectiveGroup) {

        Ext.each(programBlockUnit.ChildUnits(), function (childUnit) {
            childUnit.set('ID', 0);
            childUnit.set('ProgramBlockID', 0);
            childUnit.set('ProgramTemplateBlockSemesterID', 0);
            childUnit.set('ParentID', null);
        });
    }

    return programBlockUnit;
}













function CreateModel(rawData, model, root) {
    var reader = new Ext.data.reader.Json({
        model: model,
        root: root || 'root'
    });


    var obj = Ext.JSON.decode(rawData);

    var result = reader.readRecords(obj);

    if (result.records.length > 0) {
        return result.records[0];
    }

    return null;


}



function ModelToJson(model) {
    var data = {};

    var modelClassName = Ext.getClassName(model);

    var selfreferencing = false;


    Ext.each(model.associations.items, function (item, index) {
        selfreferencing = selfreferencing || (Ext.getClassName(item.associatedModel) == modelClassName);
        return true;
    });


    data = model.getData();

    //TODO self referencing check
    //TODO cyclic reference check

    if (selfreferencing || true) {
        Ext.applyIf(data, model.serializeToJson({}, 1));
    }
    else {
        Ext.applyIf(data, model.getAssociatedData(true));
    }
    return data;
}






function NewTab(form, title) {
    var tabp = Ext.ComponentQuery.query('tabpanel#maintabpanel')[0];




    var tab = Ext.create('Ext.panel.Panel', {
        closable: true,
        layout: 'fit',
        autoScroll: true,
        title: title || form.title,
        items: [form],


        listeners: {
            beforeclose: {
                //fn: function (panel) {
                //    console.log('close');
                //    if (!IsNullOrEmpty(form.closeWarning)) {
                //        CheckAction('შეუნახავი მონაცემები დაიკარგება', function () {
                //            panel.suspendEvents();

                //            panel.close();
                //        });

                //        return false;
                //    }

                //    return true;
                //}

                fn: function (panel) {
                    console.log('close');
                    if (!IsNullOrEmpty(form.closeWarning)) {
                        if (!IsNull(form.isDataChanged) && form.isDataChanged()) {
                            CheckAction('შეუნახავი მონაცემები დაიკარგება! გინდათ გასვლა?', function () {
                                panel.suspendEvents();

                                panel.close();
                            });

                            return false;
                        }
                    }

                    return true;
                }
            }
        },
    });

    //form.title = '';

    tabp.add(tab);

    tabp.setActiveTab(tab);

}



function Request(url, data, successfn, failurefn, form) {

    var el = (form != null) ? form.getEl() : Ext.getBody();
    (el.mask('იტვირთება...')).dom.style.zIndex = '20000';

    Ext.Ajax.request({
        url: url,
        method: 'POST',
        jsonData: data,
        timeout: 240000,
        success: function (response, options) {
            if (successfn !== undefined) {
                var obj = Ext.JSON.decode(response.responseText);
                if (obj.success) {
                    successfn(response.responseText);
                    el.unmask();
                }
                else {
                    //Ext.getBody().unmask();
                    el.unmask();
                    MessageBox('', obj.msg);
                    //failurefn();
                }
            }


        },


        failure: function (response, options) {
            el.unmask();
            MessageBox('', 'შეცდომა სერვერთან დაკავშირების დროს');

            //if (failurefn !== undefined) {
            //    failurefn();
            //}
        }

    });
}
//Jaginoff
function IsNull(value) {
    return value === null || value === undefined
}
function ArrayWhere(array, key, keyvalue) {
    var result = [];
    Ext.each(array, function (item) {
        if (item.get(key) == keyvalue)
            result.push(item);
    });
    return result;
}
function ArraySelect(modelarray, key) {
    var result = [];
    if (!IsNullOrEmpty(modelarray) && !IsNullOrEmpty(key)) {
        Ext.each(modelarray, function (model) {
            result.push(model.get(key));
        });
    }
    return result;

}
function ArraySetValue(modelarray, key, keyvalue) {
    var result = [];
    if (!IsNullOrEmpty(modelarray) && !IsNullOrEmpty(key)) {
        Ext.each(modelarray, function (model) {
            model.set(key, keyvalue);
            result.push(model);
        });
    }
    return result;
}
//G. D.

function IsNullOrEmpty(value) {
    return value === null || value === undefined || value === '';
}

function SetObjecAttributeModelValue(ObjectAttributeModel, value) {

}


function CreateObjectAttributeValueModel(valueTypeID) {
    var ObjectAttributeValueModel = Ext.create('SIS.model.ObjectAttributeValueModel');
    //ObjectAttributeValueModel.set('CLRType', 'System.String');
    ObjectAttributeValueModel.set('ValueTypeID', valueTypeID);


    var defaultValue;

    switch (valueTypeID) {
        case EnumValueTypes.Integer:
            {
                defaultValue = 0;
            }
            break;
        case EnumValueTypes.Boolean:
            {
                defaultValue = false;
            }
            break;
        case EnumValueTypes.String:
            {
                defaultValue = '';
            }
            break;
        case EnumValueTypes.Binary:
            {
                defaultValue = 0;
            }
            break;
        case EnumValueTypes.DateTime:
            {
                defaultValue = '1900-01-01 00:00:00';
            }
            break;
        default: break;
    }
    ObjectAttributeValueModel.set('Value', defaultValue);


    return ObjectAttributeValueModel;
}



function CreateObjectAttributeModel(attributeID, valueTypeID) {
    var ObjectAttributeModel = Ext.create('SIS.model.ObjectAttributeModel');
    //var AttributeModel = Ext.create('SIS.model.AttributeModel');
    var ObjectAttributeValueModel = Ext.create('SIS.model.ObjectAttributeValueModel');
    //ObjectAttributeValueModel.set('CLRType', 'System.String');
    ObjectAttributeValueModel.set('ValueTypeID', valueTypeID);
    ObjectAttributeModel.set('ValueTypeID', valueTypeID);
    ObjectAttributeModel.set('AttributeID', attributeID);
    //AttributeModel.set('ValueTypeID', valueTypeID);

    var defaultValue;

    switch(valueTypeID)
    {
        case EnumValueTypes.Integer:
            {
                defaultValue = 0;
            }
            break;
        case EnumValueTypes.Boolean:
            {
                defaultValue = false;
            }
            break;
        case EnumValueTypes.String:
            {
                defaultValue = '';
            }
            break;
        case EnumValueTypes.Binary:
            {
                defaultValue = 0;
            }
            break;
        case EnumValueTypes.DateTime:
            {
                defaultValue = '1900-01-01 00:00:00';
            }
            break;
        default: break;
    }
    ObjectAttributeValueModel.set('Value', defaultValue);

    //ObjectAttributeModel.setAttributeModel(AttributeModel);
    var valStore = ObjectAttributeModel.ObjectAttributeValues();
    valStore.add(ObjectAttributeValueModel);
    return ObjectAttributeModel;
}
function UpdateObjectAttribute(objectAttributeModel, newValue) {

}


// M.O 22.01.2014
/*
function ObjectAttributeExists(arrayOfAttributes, attributeModel){
    // Result of validation
    // true - attribute dosn't exist and can be added
    // false - attribute already exist and can't be added

    if (arrayOfAttributes === null || arrayOfAttributes === undefined) return false;

    if (attributeModel === null || attributeModel === undefined) return false;

    var result = false;

    var attributeID = attributeModel.get('AttributeID');
    Ext.each(arrayOfAttributes, function (attribute) {
        if (attribute.get('AttributeID') === attributeID) {
            result = true;
            return false;
}
    });

    return result;
}*/

// M.O.

function CloneModel(model) {
    if (model === null || model === undefined) return;

    var className = Ext.ClassManager.getName(model);
    var tmp = ModelToJson(model);
    var data = {
        root: tmp,
        success: true
    };
    var str = Ext.JSON.encode(data);

    return CreateModel(str, className);
}


//create empty child model from base model data
function EmptyChildFromBase(childModelClassName, baseModel) {
    
    var tmp = ModelToJson(baseModel);
    var data = {
        root: tmp,
        success: true
    };

    var str = Ext.JSON.encode(data);

    return CreateModel(str, childModelClassName);

}


function CompareModel(model1, model2) {

    if (model1 === null || model1 === undefined || model2 === null || model2 === undefined) return;

    var json1 = ModelToJson(model1);
    var json2 = ModelToJson(model2);

    var string1 = Ext.JSON.encode(json1);
    var string2 = Ext.JSON.encode(json2);

    return (string1 === string2);

}

//Jaginoff/
function MakeTrackedModel(className) {
    var model = Ext.create(className);
    var id = Ext.id().substr(7);
    model.set('ID', 0 - id);

    return model;
}

function GetCurrentUser() {
    var viewport = Ext.ComponentQuery.query('viewport')[0];
    return viewport.CurrentUser != null ? viewport.CurrentUser : null;
}

function FieldIsEditable(field,form)
{
    var editingAllowed=false;
    var objActions=form.GetObjectAllowedActions();
    Ext.each(objActions, function (code) {
        if (field.userActionId == code)
        {
            editingAllowed = true;
        }
    });
    var editingPermitted=false;
    Ext.each(GetCurrentUser().UserActions, function (action) {
        if (action.Code == field.userActionId) {
            editingPermitted = true;
            return false;
        }
    });
    return editingAllowed && editingPermitted;
}
function CheckFieldEditingAllowed(element, formStatusID, formRequiredStatus) {
    
    var editable = (formStatusID == formRequiredStatus);

    var editingAllowed = false;

    Ext.each(GetCurrentUser().UserActions, function (action) {
        if (action.Code == element.userActionId) {
            editingAllowed = true;
            return false;
        }
    });

    return editingAllowed && editable;

}
// Apply permitions to form/panel (set controls enabled/disabled/readOnly )
function ApplyPermissions(form, userAllowedActions, objectAllowedActions) {

    if (form === null || form === undefined
        || userAllowedActions === null || userAllowedActions === undefined
        || objectAllowedActions === null || objectAllowedActions === undefined) return null;

    var userAllowedActionNames = [];
    Ext.each(userAllowedActions, function(action){
        userAllowedActionNames.push(action.Code);
    });

    var allowedActions = [];
    allowedActions = IntersecArrays(userAllowedActionNames, objectAllowedActions);

    // Disable form all controls
    DisableControls(form);

    // ApplyPermissions to buttons
    Ext.each(form.query('button'), function (button) {
        if (!IsNull(button.userActionId) && arrayContainsValue(allowedActions, button.userActionId)) {
            if (button.isDisabled()) {
                button.setDisabled(false);
            }
        }
    });

    // ApplyPermissions to fields
    Ext.each(form.query('field'), function (field) {
        if (!IsNull(field.userActionId) && arrayContainsValue(allowedActions, field.userActionId)) {
                field.setReadOnly(false);
            }
    });

    //Ext.each(form.query('htmleditor'), function (field) {
    //    if (!IsNull(field.userActionId) && arrayContainsValue(allowedActions, field.userActionId)) {
    //            field.setDisabled(false);
    //        }
    //});

    // ApplyPermissions to actionColumns
    Ext.each(form.query('actioncolumn'), function (actioncolumn) {
        if (!IsNull(actioncolumn.userActionId) && arrayContainsValue(allowedActions, actioncolumn.userActionId)) {
            actioncolumn.enableAction();
            //actioncolumn.show();
            //actioncolumn.disableAction();
            //actioncolumn.setDisabled(false);
            if (!IsNull(actioncolumn.hideOnUserActionDenied) && actioncolumn.hideOnUserActionDenied == true) {
                actioncolumn.show();
        }
        }
    });

    // ApplyPermissions to CheckColumns
    Ext.each(form.query('checkcolumn'), function (checkcolumn) {
        if (!IsNull(checkcolumn.userActionId) && arrayContainsValue(allowedActions, checkcolumn.userActionId)) {
            if (checkcolumn.isDisabled()) {
                checkcolumn.setDisabled(false);
            }
        }
    });

    // selectionModel
    Ext.each(form.query('gridpanel'), function (gridpanel) {
        if (!IsNull(gridpanel.disableMultySelectionOnActionDenied) 
            && gridpanel.disableMultySelectionOnActionDenied
            && arrayContainsValue(allowedActions, gridpanel.userActionId)) {

            gridpanel.getSelectionModel().setSelectionMode('MULTI');
        }
    });
}

function DisableControls(form) {
    if (IsNull(form)) return null;

    Ext.each(form.query('button'), function (button) {
        if (!IsNull(button.userActionId)) {
            button.setDisabled(true);
        }
    });

    Ext.each(form.query('field'), function (field) {
        if (!IsNull(field.userActionId)) {
            field.setReadOnly(true);
            }
    });

    Ext.each(form.query('actioncolumn'), function (actioncolumn) {
        if (!IsNull(actioncolumn.userActionId)) {
            actioncolumn.disableAction();
            //actioncolumn.hide();
            //actioncolumn.setDisabled(true);
            if (!IsNull(actioncolumn.hideOnUserActionDenied) && actioncolumn.hideOnUserActionDenied == true) {
                actioncolumn.hide();
            }
        }
    });
    Ext.each(form.query('checkcolumn'), function (checkcolumn) {
        if (!IsNull(checkcolumn.userActionId)) {
            checkcolumn.setDisabled(true);
        }
    });

    Ext.each(form.query('gridpanel'), function (gridpanel) {
        if (!IsNull(gridpanel.disableMultySelectionOnActionDenied) && gridpanel.disableMultySelectionOnActionDenied) {
            gridpanel.getSelectionModel().setSelectionMode('SINGLE');
        }
    });

    // Disable Html Editor
    //Ext.each(form.query('htmleditor'), function (field) {
    //    if (!IsNull(field.userActionId)) {
    //        field.setDisabled(true);
    //    }
    //});
}

function IntersecArrays(A, B) {
    var m = A.length;
    var n = B.length;
    var c = 0;
    var result = [];

    for (var i = 0; i < m; i++) {
        var j = 0, k = 0;
        while (B[j] !== A[i] && j < n) j++;
        while (result[k] !== A[i] && k < c) k++;
        if (j != n && k == c) result[c++] = A[i];
    }
    return result;
}

//M.O.
function TrimString(str) {
    // && str instanceof String
    if (!IsNull(str)) {
        //return x.replace(/^\s+|\s+$/gm,'');
        return str.trim();
    }
    else {
        return str;
    }
}

//M.O.
function StripHTML(str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
}

var EnumProgramTypeStatus = {
    Editable: 14,
    Active: 15,
    Blocked: 16

};
var EnumStudyLanguageStatus = {
    Editable: 11,
    Active: 12,
    Blocked: 13

};
var EnumStudyComponentStatus = {
    Editable: 8,
    Active: 9,
    Blocked: 10

};


var EnumProgramTemplateBlockType = {
    Fixed: 1,
    Selective: 2
};

var EnumProgramBlockUnitType = {
    Course: 1,
    SelectiveCourse: 2,
    SelectiveGroup: 3,
    SelectiveBlock: 4
};
var EnumOrganizationalUnits = {
    GTU: 1,
    Info: 9,
    Energo: 7,
    Ekonom: 8,
    Trasport: 9,
    Chemistry: 10
};
var OrgUnitsCodeDictionary = {
    'GTU': 1,
    'F01': 2,
    'F02': 3,
    'F03': 4,
    'F04': 5,
    'F05': 6
};
var OrganizationalUnitsDictionary = {
    'GTU': 1,
    'Info': 2,
    'Energo': 3,
    'Ekonom': 4,
    'Trasport': 5,
    'Chemistry': 6
};
var EnumOrganizationalUnitType = {
        Root: 4,
        Faculty: 1,
        AcademicDepartment: 2,
        StudyDepartment: 3
};

var EnumOrganizationalUnitTypeParentIDs = {
    Faculty: 1
};


var EnumProgramTemplateStatuses = {
    Editable: 17,
    Published: 18,
    Locked: 19
};

var EnumCourseStatuses = {
    Editable: 1,
    Active: 2,
    ActiveLocked: 3
};

var EnumValueTypes = {
    Integer: 3,
    String: 4,
    Boolean: 5,
    Binary: 6,
    DateTime: 7,
};

//TODO nazvanie standartnoe EnumProgramConfigStatus
var EnumProgCfgSt = {
    Editable: 1,
    Presented: 2,
    Active: 3
};



var EnumDialogResult = {
    Success: 1,
    Error: -1,
    None: 0
};


var EnumProgramStatus = {
    Editable: 1,
    Presented: 2,
    Active: 3,
    Blocked: 4
};

var EnumCourseType = {
    University: 39,
    Faculty: 41
};

var EnumSemesterTypeStatus = {
    Editable: 5,
    Active: 6,
    Blocked: 7
}

var EnumOrganizationalUnitStatus = {
    Editable: 21,
    Active: 22,
    Locked: 23
}

var EnumObjectType = {
    Programs: 1,
    Course: 2,
    ProgramCourseConfig: 1002,
    OrganizationalUnit: 1003
}


var EnumRelationTypeGroup = {
    CourseEmployee: 2,
    ProgramEmployee: 3,
    ProgramFaculty: 4
};

var EnumRelationType = {
    //TODO iyo 1 adre
    Author: 5,
    LeaderWithConfig: 1,
    Leader: 2,
    MainOrgUnit: 3,
    AuxOrgUnit: 4
};

var EnumProgramDepartmentConfigStatus={
    Editable: 28,
    Presented: 29,
    Active: 30,
    Blocked: 31,
}
var EnumProgramGeneralConfigStatus={
    Editable : 24,
    Presented : 25,
    Active : 26,
    Blocked : 27
}
var EnumProgramFacultyConfigStatus={
    Editable : 32,
    Presented : 33,
    Active : 34,
    Blocked : 35
}

var EnumProgramManagerConfigStatus = {
    Editable: 36,
    Presented: 37,
    Active: 38,
    Blocked: 40
};

var EnumAttributes = {
    MinNumberOfLaboratories: 1016
};

var EnumStudyComponents = {
    Laboratory: 1080,
    Lecture: 1077,
    Seminar: 1078,
    Practical: 1079,
    Practice: 1081,
    CourseProject: 1082,
    IndependentWork: 1083,
    Research: 1084
};



eng = new Array(97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 87, 82, 84, 83, 67, 74, 90);
geo = new Array(4304, 4305, 4330, 4307, 4308, 4324, 4306, 4336, 4312, 4335, 4313, 4314, 4315, 4316, 4317, 4318, 4325, 4320, 4321, 4322, 4323, 4309, 4332, 4334, 4327, 4310, 4333, 4326, 4311, 4328, 4329, 4319, 4331, 91, 93, 59, 39, 44, 46, 96);


function keyfilter_num(evt) {
    evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        status = "This field accepts numbers only."
        return false
    }
    status = ""
    return true
}

function keyfilter_dig(evt) {
    evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        status = "This field accepts numbers only."
        return false
    }
    status = ""
    return true
}

function ValidEmail(EmailAddr) {
    var reg1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
    var reg2 = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;

    var SpecChar = "!#$%^&*()'+{}[]\|:;?/><,~`" + "\"";
    var frmValue = new String(EmailAddr);
    var len = frmValue.length;

    if (len < 1) { return false; }
    for (var i = 0; i < len; i++) {
        temp = frmValue.substring(i, i + 1)
        if (SpecChar.indexOf(temp) != -1) {
            return false;
        }
    }

    if (!reg1.test(frmValue) && reg2.test(frmValue)) {
        return true;
    }

    return false;
}

function keyfilter_alnum(evt) {
    evt = (evt) ? evt : window.event
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (!((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || charCode == 95)) {
        status = "This field accepts 'a'-'z','A'-'Z','0'-'9' and '_' only."
        return false
    }
    status = ""
    return true
}

function makeGeo(ob, e) {
    code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

    //if (code == 96) {
    //    document.getElementById('geoKeys').checked = !document.getElementById('geoKeys').checked;
    //    return false;
    //}

    //if (e.which == 0) return true;

    //if (!document.getElementById('geoKeys').checked) return true;



    //alert(' e.keyCode='+e.keyCode+'\n'+'e.which='+e.which+'\n'+'e.charCode='+e.charCode);

    var found = false;
    for (i = 0; i <= geo.length; i++) {
        if (eng[i] == code) {
            c = geo[i];
            found = true;
        }
    }

    if (found) {
        if (document.selection) {
            sel = document.selection.createRange();
            sel.text = String.fromCharCode(c);
        } else {
            if (ob.selectionStart || ob.selectionStart == '0') {
                var startPos = ob.selectionStart;
                var endPos = ob.selectionEnd;
                ob.value = ob.value.substring(0, startPos) + String.fromCharCode(c) + ob.value.substring(endPos, ob.value.length);
                ob.selectionStart = startPos + 1;
                ob.selectionEnd = endPos + 1;
            } else {
                //ob.value = ob.value + String.fromCharCode(c);
                return true;
            }
        }
        return false;
    } else {
        return true;
    }

}

