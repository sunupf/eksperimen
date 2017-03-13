require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element(:css => '.add.todo').displayed? }

    element = @driver.find_element :css => '.add.todo'
    element.click

    wait.until { @driver.find_element(:css => '#add-todo .uk-modal-dialog').displayed? }

    inputs = @testCase['testCases']

    inputs.each do |key,input|
      element = @driver.find_element :css => "#add-todo #{key}"
      element.send_keys input
    end

    buttonSubmit = @driver.find_element :css => "#add-todo .uk-button-primary"
    buttonSubmit.click
    # #
    wait = Selenium::WebDriver::Wait.new(:timeout => 3)

    respon = wait.until {
      @driver.find_element :css => ".sweet-alert.visible h2, .uk-alert .uk-list"
    }

    respons = @driver.find_elements :css => ".sweet-alert.visible h2, .uk-alert .uk-list li"

    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end
    #
    expect = @testCase['messages']
    puts Set.new(expect) === Set.new(result)
    return Set.new(expect) === Set.new(result)
  end
end
