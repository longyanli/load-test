/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2020 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/
import hudson.model.Result
import groovy.json.JsonOutput
import jenkins.model.CauseOfInterruption.UserInterruption
import org.jenkinsci.plugins.workflow.steps.FlowInterruptedException
import java.text.SimpleDateFormat
import java.util.regex.Matcher

projectName = "load-test"
stageStatus = 'SUCCESS'
_jiraIssues = []
_publishedPackageNames = []
_toplevelChangesOnBranch = null
_buildDescription = ""
DEFAULT_NODE_VERSION = "20.9.0"

GIT_ORG = "neuralfiltersplatform"
GIT_REPO = "spl-web-client"
IS_MAIN_BRANCH = env.BRANCH_NAME.equals('main') ? true : false
IS_RELEASE_BRANCH = env.BRANCH_NAME.startsWith('release') ? true : false

ROOT_WORKSPACE = ""

gitUsers = null
generalSlackChannel = "#splweb-jenkins"
